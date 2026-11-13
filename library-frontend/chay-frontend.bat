@echo off
chcp 65001 >nul
title Thu vien Tri Thuc - Frontend
cd /d "%~dp0"
where node >nul 2>nul || (echo [LOI] Chua cai Node.js. Tai ban LTS tai https://nodejs.org roi chay lai file nay. & pause & exit /b 1)
echo Node: & node -v
if not exist node_modules (
  echo === Dang cai thu vien npm, lan dau mat 1-3 phut... ===
  call npm install || (echo [LOI] npm install that bai. & pause & exit /b 1)
)
echo === Dang chay http://localhost:5173 - dong cua so nay de dung ===
call npm run dev
pause
