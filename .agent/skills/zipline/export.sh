#!/bin/bash

# Zipline Export Script
# Automates building and preparing a project for Zipline deployment.

set -e

# Ensure npm function does not shadow executable
unset -f npm

npm () 
{ 
    /usr/local/bin/gpkg npm "$@"
}


# --- Configuration ---
EXPORT_DIR="html-app"
BUILD_DIR=""
PROJECT_ROOT=$(pwd)
UPLOAD=false
SETUP=false
PROJECT_ID=""
VERSION=""

# Search for a .node_runtime directory upward or in PWD
search_node_runtime() {
    local current_dir=$(pwd)
    while [ "$current_dir" != "/" ]; do
        if [ -d "$current_dir/.node_runtime" ]; then
            echo "$current_dir/.node_runtime"
            return 0
        fi
        current_dir=$(dirname "$current_dir")
    done
    return 1
}



# Add Google Git SSO helper paths
export PATH="$PATH:/usr/local/git/git-google/bin"

# --- Helper Functions ---

log() {
    echo "[Zipline] $1"
}

error() {
    echo "[Error] $1" >&2
    exit 1
}

parse_args() {
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --upload) UPLOAD=true ;;
            --setup) SETUP=true ;;
            --project_id) PROJECT_ID="$2"; shift ;;
            --version) VERSION="$2"; shift ;;
            --root) PROJECT_ROOT="$2"; shift ;;
            --project_dir) PROJECT_ROOT="$2"; shift ;;
            *) echo "Unknown parameter passed: $1"; exit 1 ;;
        esac
        shift
    done
}

detect_project_type() {
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        log "Detected Vite project."
        BUILD_DIR="dist"
        BUILD_CMD="npm run build"
    elif grep -q "\"build\":" package.json 2>/dev/null; then
        log "Detected npm-based project."
        # Try to guess build dir, common ones are dist, build, out
        BUILD_CMD="npm run build"
        # We'll run build first then check for common dirs
    elif [ -f "index.html" ]; then
        log "Detected plain HTML project."
        BUILD_DIR="."
        BUILD_CMD=""
    else
        error "Could not detect project type. Ensure you have index.html or a package.json with a build script."
    fi
}

ensure_node_npm() {
    log "Checking Node.js and npm..."
    
    # If already available globally or via .node_runtime
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        return 0
    fi
    
    log "Node.js not found in PATH. Checking for local portable version..."
    
    local local_node_dir="$HOME/.agents/skills/zipline/local-node"
    
    if [ -x "$local_node_dir/bin/node" ] && [ -x "$local_node_dir/bin/npm" ]; then
        log "Found existing local Node.js at $local_node_dir. Adding to PATH."
        export PATH="$local_node_dir/bin:$PATH"
        return 0
    fi
    
    log "Bootstrapping a portable Node.js environment automatically..."
    mkdir -p "$local_node_dir"
    
    local os_raw=$(uname -s | tr '[:upper:]' '[:lower:]')
    local arch_raw=$(uname -m)
    local node_arch=""
    
    if [ "$arch_raw" = "x86_64" ]; then
        node_arch="x64"
    elif [ "$arch_raw" = "arm64" ] || [ "$arch_raw" = "aarch64" ]; then
        node_arch="arm64"
    else
        error "Unsupported architecture for automated Node.js installation: $arch_raw"
    fi
    
    local node_version="v20.11.1" # LTS version
    local download_url="https://nodejs.org/dist/${node_version}/node-${node_version}-${os_raw}-${node_arch}.tar.gz"
    local tarball="$local_node_dir/node.tar.gz"
    
    log "Downloading Node.js $node_version for $os_raw-$node_arch..."
    if ! curl -fsSL -o "$tarball" "$download_url"; then
        error "Failed to download Node.js from $download_url"
    fi
    
    log "Extracting portable Node.js..."
    tar -xzf "$tarball" -C "$local_node_dir" --strip-components=1
    rm "$tarball"
    
    export PATH="$local_node_dir/bin:$PATH"
    
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        log "Successfully bootstrapped local Node.js! Version: $(node -v)"
    else
        error "Failed to bootstrap Node.js. Extraction may have failed."
    fi
}

run_build() {
    # Ensure common paths are in PATH
    export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:$PATH"

    ensure_node_npm

    if [ -n "$BUILD_CMD" ]; then
        log "Running build command: $BUILD_CMD"
        
        # Check if npm is available, otherwise try gpkg
        if ! command -v npm &> /dev/null; then
            if [ -x "/usr/local/bin/gpkg" ]; then
                log "npm not found, trying via gpkg..."
                /usr/local/bin/gpkg npm run build || true
            else
                log "Warning: npm not found and gpkg not available."
            fi
        else
            $BUILD_CMD || true
        fi
    fi
    
    # If BUILD_DIR wasn't set (non-Vite npm projects), look for it
    if [ -z "$BUILD_DIR" ] || [ "$BUILD_DIR" == "." ]; then
        if [ -d "dist" ]; then BUILD_DIR="dist";
        elif [ -d "build" ]; then BUILD_DIR="build";
        elif [ -d "out" ]; then BUILD_DIR="out";
        else
            # If no dir found, maybe it built in-place or we only have index.html now
            if [ -f "dist/index.html" ]; then BUILD_DIR="dist";
            elif [ -f "build/index.html" ]; then BUILD_DIR="build";
            else BUILD_DIR="."; fi
        fi
    fi
    log "Using build directory: $BUILD_DIR"
}

prepare_export_dir() {
    log "Preparing $EXPORT_DIR directory..."
    mkdir -p "$EXPORT_DIR"
    # Clean but preserve hidden files if any (usually none)
    rm -rf "${EXPORT_DIR:?}"/*
    
    # Copy build artifacts
    if [ "$BUILD_DIR" == "." ]; then
        # Copy everything EXCEPT export dir itself and node_modules
        rsync -a --exclude="$EXPORT_DIR" --exclude="node_modules" --exclude=".git" . "$EXPORT_DIR/"
    else
        cp -r "$BUILD_DIR"/* "$EXPORT_DIR/"
    fi
}

post_process_html() {
    local index_file="$EXPORT_DIR/index.html"
    if [ ! -f "$index_file" ]; then
        # Try to find it if it's nested (happens with some frameworks)
        local found_index
        found_index=$(find "$EXPORT_DIR" -name "index.html" | head -n 1)
        if [ -n "$found_index" ] && [ "$found_index" != "$index_file" ]; then
            log "Moving nested index.html to root: $found_index"
            mv "$found_index" "$index_file"
        else
            error "index.html not found in export directory."
        fi
    fi

    log "Ensuring <base href='./'> in index.html..."
    if grep -q "<base" "$index_file"; then
        # Update existing base tag
        sed -i '' 's|<base href="[^"]*"|<base href="./"|g' "$index_file" 2>/dev/null || \
        sed -i 's|<base href="[^"]*"|<base href="./"|g' "$index_file"
    else
        # Inject base tag after <head>
        sed -i '' 's|<head>|<head>\n    <base href="./">|g' "$index_file" 2>/dev/null || \
        sed -i 's|<head>|<head>\n    <base href="./">|g' "$index_file"
    fi
}

check_zipline_cli() {
    # Add local bin to PATH so we can find it if installed locally
    export PATH="$HOME/.zipline-local/bin:$PATH"

    if ! command -v zipline &> /dev/null; then
        log "Zipline CLI not found. Attempting to install locally..."
        
        mkdir -p "$HOME/.zipline-local"

        # Method A: Standard Install (Local)
        log "Attempt A: npm install --prefix $HOME/.zipline-local -g git+https://uxe-internal.googlesource.com/zipline-cli"
        if npm install --prefix "$HOME/.zipline-local" -g git+https://uxe-internal.googlesource.com/zipline-cli 2>/dev/null; then
            log "Standard installation succeeded."
        else
            log "Standard installation failed. Trying Attempt B: Clone via SSO..."
            # Method B: Clone Fallback
            local temp_dir="$(pwd)/.zipline-cli-installer"
            rm -rf "$temp_dir"
            if git clone sso://uxe-internal/zipline-cli "$temp_dir"; then
                log "Clone succeeded. Installing from source..."
                (cd "$temp_dir" && npm pack && npm install --prefix "$HOME/.zipline-local" -g ./*.tgz)
                rm -rf "$temp_dir"
            else
                log "Fallback clone also failed."
            fi
        fi
        
        # Check if login helper is needed and try to install it too
        if ! command -v uplink-helper &> /dev/null; then
            log "uplink-helper not found. Trying to install it too..."
            log "Warning: Cannot auto-install uplink-helper. You might need it for authentication."
        fi
        
        # Clear Bash hash cache so it finds the newly installed binary
        hash -r 2>/dev/null || true
        
        # Check if install succeeded
        if ! command -v zipline &> /dev/null; then
            log "==========================================================="
            log "❌ ERROR: Zipline CLI Installation Failed"
            log "This happens because your computer needs to securely link to Google's Git."
            log ""
            log "🚀 HOW TO FIX THIS (Step-by-Step for Mac Users):"
            log "-----------------------------------------------------------"
            log "STEP 1: Open the 'Terminal' App"
            log "👉 Press [Cmd ⌘] + [Spacebar] on your keyboard."
            log "👉 Type 'Terminal' into the search bar and hit Enter."
            log ""
            log "STEP 2: Get your Authentication Code"
            log "👉 Click this link to open it in Chrome/Safari:"
            log "   🔗 https://uxe-internal.googlesource.com/new-password"
            log "👉 Log in using your standard @google.com account."
            log "👉 You will see a block of text/code inside a shaded box."
            log ""
            log "STEP 3: Paste the Code"
            log "👉 Copy ALL the text inside that box."
            log "👉 Go back to the 'Terminal' app you opened in Step 1."
            log "👉 Paste the text (Press [Cmd ⌘] + [V]) and hit Enter."
            log "-----------------------------------------------------------"
            log "STEP 4: You're Done! Re-run this Skill"
            log "👉 Come back to Jetski and tell it to run the setup again."
            log "==========================================================="
            exit 1
        fi
    fi
}


trigger_upload() {
    if [ "$UPLOAD" = true ]; then
        check_zipline_cli
        
        log "Triggering Zipline upload..."
        local cmd="zipline upload --source $EXPORT_DIR"
        if [ -n "$PROJECT_ID" ]; then cmd="$cmd --project_id $PROJECT_ID"; fi
        if [ -n "$VERSION" ]; then cmd="$cmd --version $VERSION"; fi
        
        log "Executing: $cmd (Piping '1' for asset auto-selection if prompt appears)"
        if [ -n "$PROJECT_ID" ]; then
            printf "1\n" | $cmd || log "Warning: Upload failed. Ensure you are logged in (uplink-helper login)."
        else
            printf "1\n1\n" | $cmd || log "Warning: Upload failed. Ensure you are logged in (uplink-helper login)."
        fi
    fi
}





# --- Main ---

parse_args "$@"

if [ "$SETUP" = true ]; then
    log "=================================================="
    log "🛠️ Running Zipline First-Time Setup"
    log "=================================================="
    
    # Ensure common paths are in PATH
    export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:$PATH"
    
    ensure_node_npm
    check_zipline_cli
    log ""
    log "✅ SUCCESS: The Zipline system is fully installed!"
    log "-----------------------------------------------------------"
    log "🛑 WAIT - YOU MUST DO ONE MORE THING 🛑"
    log "You need to log into Zipline before it will let you upload."
    log ""
    log "👉 HOW TO LOG IN (Mac Users):"
    log "1. Open the Terminal app (Press [Cmd ⌘] + [Spacebar], type 'Terminal', hit Enter)."
    log "2. Copy exactly this:"
    log ""
    log "     uplink-helper login"
    log ""
    log "3. Paste it into your Terminal and hit Enter."
    log "4. Complete the prompt on your screen."
    log ""
    log "🎉 You're finished! You can now tell Jetski to upload your app."
    log "==========================================================="
    exit 0
fi

# Switch to the target project directory
cd "$PROJECT_ROOT"
log "Project root set to: $(pwd)"

log "Searching for local Node runtime..."
NODE_RUNTIME_DIR=$(search_node_runtime) || true
if [ -n "$NODE_RUNTIME_DIR" ]; then
    # Find the bin directory inside the runtime
    BIN_DIR=$(find "$NODE_RUNTIME_DIR" -type d -name "bin" | head -n 1)
    if [ -n "$BIN_DIR" ]; then
        log "Adding local Node runtime to PATH: $(dirname "$BIN_DIR")/bin" # Just in case it's not a direct bin
        # Actually, let's just use the bin found
        export PATH="$BIN_DIR:$PATH"
    fi
fi

detect_project_type
run_build
prepare_export_dir
post_process_html
trigger_upload

log "Success! Zipline-ready app is in /$EXPORT_DIR"
