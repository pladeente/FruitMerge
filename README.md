# Fruit Merge

Drop fruit, merge matching ones, make a watermelon. Everything lives in `index.html`.

## World leaderboard setup (Firebase, free tier)

Without this the game still works and keeps scores on the device only.

1. Go to https://console.firebase.google.com, create a project (Analytics not needed).
2. **Build → Realtime Database → Create database**. Pick a region, start in **locked mode**.
3. Open the **Rules** tab, paste the contents of `database.rules.json`, click **Publish**.
4. Copy the database URL shown at the top of the **Data** tab, e.g. `https://fruit-merge-1234-default-rtdb.firebaseio.com`.
5. In `index.html`, set it on this line:
   ```js
   const LB_URL='https://fruit-merge-1234-default-rtdb.firebaseio.com';
   ```
6. Commit and host the page (GitHub Pages works).

Scores are stored under `scores/classic` and `scores/wild`. The rules allow reading, and adding new entries only (no edits or deletes), with a name of 1 to 12 characters and a score under 1,000,000. To wipe a board, delete the node in the Firebase console.

Note: any browser game that submits its own score can be cheated by someone who edits the request. The rules stop junk data and overwrites, not a determined cheater.
