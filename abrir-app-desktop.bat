@echo off
cd /d "%~dp0"
set NODE_ENV=development
pnpm exec electron .
