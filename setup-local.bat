@echo off
cd /d %~dp0
if not exist .env (
  echo Crie o arquivo .env antes de continuar.
  exit /b 1
)
call pnpm install
if errorlevel 1 exit /b 1
call node importar-dados.mjs
if errorlevel 1 exit /b 1
call pnpm build:local
if errorlevel 1 exit /b 1
echo.
echo Pronto. Agora rode: pnpm dev
