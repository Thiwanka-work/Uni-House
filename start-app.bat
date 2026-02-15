@echo off
echo Starting PHP Backend...
start "PHP Backend" "C:\xampp\php\php.exe" -S localhost:8000 -t "boarding-finder/backend"

echo Starting Frontend...
cd frontend
npm run dev
