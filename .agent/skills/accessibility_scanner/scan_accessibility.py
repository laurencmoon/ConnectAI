import os
import re

def scan_accessibility(start_dir):
    violations = []
    skip_dirs = {'.git', 'node_modules', '__pycache__'}
    
    # Simple check for img tags missing alt
    img_pattern = re.compile(r'<img[^>]*>')
    
    for root, dirs, files in os.walk(start_dir):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                # We can find all images and check if alt is missing
                images = img_pattern.findall(content)
                for img in images:
                    if 'alt="' not in img and "alt='" not in img:
                        violations.append({
                            'file': path,
                            'type': 'Image missing alt',
                            'snippet': img.strip()
                        })
                
    return violations

if __name__ == "__main__":
    workspace_root = "/Users/laurenmoon/Desktop/JETSKI Experiments"
    violations = scan_accessibility(workspace_root)
    print(f"Found {len(violations)} Accessibility Issue(s):")
    for v in violations:
        print(f"\n- **{os.path.basename(v['file'])}** ({v['type']})")
        print(f"  Snippet: `{v['snippet']}`")
