@echo off
cd /d "%~dp0"
echo Instalando dependencias do app desktop...
pnpm add -D electron electron-builder wait-on
if errorlevel 1 goto :erro

echo Gerando build local...
pnpm build:local
if errorlevel 1 goto :erro

echo Pronto. Agora voce pode abrir com abrir-app-desktop.bat
pause
exit /b 0

:erro
echo.
echo Ocorreu um erro durante a instalacao.
pause
exit /b 1
