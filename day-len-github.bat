@echo off
chcp 65001 >nul
title Day code len GitHub
cd /d "%~dp0"
where git >nul 2>nul || (echo [LOI] May chua cai Git. Tai tai https://git-scm.com/download/win , cai mac dinh roi chay lai file nay. & pause & exit /b 1)
if not exist .git git init
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/Hanny2005/library-management.git
git config user.name >nul 2>nul || git config user.name "Hanny2005"
git config user.email >nul 2>nul || git config user.email "Hanny2005@users.noreply.github.com"
echo === Lay README co san tren GitHub ve (lan dau co the hien cua so dang nhap GitHub) ===
git pull origin main --allow-unrelated-histories --no-rebase --no-edit
git add -A
echo === Kiem tra: .env va node_modules KHONG duoc nam trong danh sach duoi ===
git status --short
git diff --cached --quiet && (echo Khong co thay doi moi.) || git commit -m "Library management: frontend giai doan 1 + database Supabase"
echo === Dang day len GitHub ===
git push -u origin main && (echo. & echo XONG! Xem tai https://github.com/Hanny2005/library-management) || (echo. & echo [LOI] Day len that bai - chup man hinh cua so nay gui Claude.)
pause
