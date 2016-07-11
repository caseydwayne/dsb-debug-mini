@echo off
title=Compiler
::setup
set origin="%CD%"

::pathwork
set sp=%origin%\..
cd %sp%

::logic
echo Compiling script...
echo.
node build
pause
cmd \k