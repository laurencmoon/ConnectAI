import os
import re

def audit_tokens(start_dir):
    violations = []
    skip_dirs = {'.git', 'node_modules', '__pycache__'}
    
    # Regex for hex colors not enclosed in var(--...) or similar
    # We look for "#[0-9a-fA-F]{3,6}" that is NOT part of a var() expression
    # Simple check: find all #hex patterns and see context.
    color_pattern = re.compile(r'#([0-9a-fA-F]{3,6})\b')
    
    for root, dirs, files in os.walk(start_dir):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if file.endswith('.css'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines):
                    matches = color_pattern.findall(line)
                    if matches:
                        # Check if it contains "var("
                        if "var(" not in line:
                            violations.append({
                                'file': path,
                                'line': i + 1,
                                'content': line.strip()
                            })
                            
    return violations

if __name__ == "__main__":
    workspace_root = "/Users/laurenmoon/Desktop/JETSKI Experiments"
    violations = audit_tokens(workspace_root)
    print(f"Found {len(violations)} Design Token Violation(s):")
    for v in violations:
        print(f"\n- **{os.path.basename(v['file'])}** (Line {v['line']})")
        print(f"  Content: `{v['content']}`")
