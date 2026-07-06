
import subprocess
import json
from datetime import datetime, timezone

def main():
    # Get all open issues
    result = subprocess.run(
        ["gh", "issue", "list", "--limit", "100", "--json", "number,title,labels,createdAt"],
        capture_output=True,
        text=True,
        cwd="/Users/zhengmin/.hermes/openclaw-workspaces/workspace/awesome-ai-ideas"
    )
    issues = json.loads(result.stdout)
    
    issues_to_close = []
    issues_with_comments = []
    
    for issue in issues:
        issue_number = issue["number"]
        labels = [label["name"] for label in issue["labels"]]
        
        # Get comments for this issue
        comment_result = subprocess.run(
            ["gh", "issue", "view", str(issue_number), "--json", "comments"],
            capture_output=True,
            text=True,
            cwd="/Users/zhengmin/.hermes/openclaw-workspaces/workspace/awesome-ai-ideas"
        )
        
        try:
            comment_data = json.loads(comment_result.stdout)
            num_comments = len(comment_data["comments"])
        except json.JSONDecodeError:
            print(f"Warning: Failed to get comments for issue #{issue_number}")
            continue
        
        if num_comments > 0:
            issues_with_comments.append(issue)
        else:
            if "quality:high" not in labels:
                issues_to_close.append(issue)
    
    print(f"\nClosing {len(issues_to_close)} issues...")
    for issue in issues_to_close:
        issue_number = issue["number"]
        print(f"Closing issue #{issue_number}: {issue['title']}")
        subprocess.run(
            ["gh", "issue", "close", str(issue_number), "--comment", "自动关闭：无评论且未标记为高质量（quality:high）。如有需要请重新打开。"],
            capture_output=True,
            text=True,
            cwd="/Users/zhengmin/.hermes/openclaw-workspaces/workspace/awesome-ai-ideas"
        )
    
    print(f"\nDone! Closed {len(issues_to_close)} issues.")
    return issues_to_close

if __name__ == "__main__":
    to_close = main()
