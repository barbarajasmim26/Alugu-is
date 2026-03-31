@echo off
cd /d "%~dp0"
echo Gerando instalador do Sistema Mesquita...
pnpm build:local
if errorlevel 1 goto :erro
pnpm exec electron-builder --win nsis
if errorlevel 1 goto :erro
echo.
echo Instalador criado na pasta release.
pause
exit /b 0

:erro
echo.
echo Nao foi possivel gerar o instalador.
pause
exit /b 1
