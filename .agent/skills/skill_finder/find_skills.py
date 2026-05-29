import os
import re

def find_skills(start_dir):
    skills = []
    # Skip standard hidden dirs that might contain a lot of noise, but check .agent
    skip_dirs = {'.git', 'node_modules', '__pycache__', '.pytest_cache'}
    
    for root, dirs, files in os.walk(start_dir):
        # Prune directories to skip
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        if 'SKILL.md' in files:
            skill_path = os.path.join(root, 'SKILL.md')
            skill_info = parse_skill(skill_path)
            skills.append(skill_info)
    return skills

def parse_skill(path):
    try:
        with open(path, 'r') as f:
            content = f.read()
    except Exception as e:
        return {
            'name': "Error",
            'description': f"Could not read file: {e}",
            'path': path
        }
    
    # Extract YAML frontmatter
    match = re.search(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        frontmatter = match.group(1)
        name_match = re.search(r'^name:\s*(.*)$', frontmatter, re.MULTILINE)
        desc_match = re.search(r'^description:\s*(.*)$', frontmatter, re.MULTILINE)
        
        name = name_match.group(1).strip() if name_match else "Unknown"
        description = desc_match.group(1).strip() if desc_match else "No description"
        return {
            'name': name,
            'description': description,
            'path': path
        }
    return {
        'name': "Unknown",
        'description': "No frontmatter found",
        'path': path
    }

if __name__ == "__main__":
    workspace_root = "/Users/laurenmoon/Desktop/JETSKI Experiments"
    skills = find_skills(workspace_root)
    print(f"Found {len(skills)} skill(s):")
    for skill in skills:
        print(f"\n- **{skill['name']}**")
        print(f"  Description: {skill['description']}")
        print(f"  Path: {skill['path']}")
