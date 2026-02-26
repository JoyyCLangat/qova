description: Update progress file and commit
---
1. Read current qova-progress.txt
2. Move completed items from "In Progress" to "Completed" with commit hash
3. Update "In Progress" with current work
4. Update "Next Up" based on build plan phase
5. `git add -A && git commit -m "chore: update progress"`
