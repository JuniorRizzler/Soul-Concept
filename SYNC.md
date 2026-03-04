# Auto Sync Downloads -> GitHub -> Vercel

## What this does
- Watches files listed in `sync-map.json`.
- Copies changed files into this repo.
- Commits only those mapped target files.
- Pushes to `origin/main` so Vercel deploys automatically.

## Run manually
```powershell
cd "C:\Users\2029089\OneDrive - Appleby College\Apps\Soul-Concept"
npm run sync:watch
```

## Run once (no watcher)
```powershell
cd "C:\Users\2029089\OneDrive - Appleby College\Apps\Soul-Concept"
npm run sync:once
```

## Add or change synced files
Edit `sync-map.json`:
```json
[
  { "source": "C:\\Users\\2029089\\Downloads\\math-study-g9.tsx", "target": "math\\FreeStudyLib.tsx" },
  { "source": "C:\\Users\\2029089\\Downloads\\anki-index.html", "target": "anki\\index.html" }
]
```

## Start automatically at login (Task Scheduler)
1. Open Task Scheduler -> Create Task.
2. Name: `SoulConcept Sync`.
3. Trigger: `At log on`.
4. Action: `Start a program`.
5. Program/script: `powershell.exe`
6. Add arguments:
   `-ExecutionPolicy Bypass -File "C:\Users\2029089\OneDrive - Appleby College\Apps\Soul-Concept\scripts\sync-downloads.ps1" -Watch`
7. Start in:
   `C:\Users\2029089\OneDrive - Appleby College\Apps\Soul-Concept`
8. Save task and run once to verify.
