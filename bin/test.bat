@echo off
title=node test
::setup
set origin="%CD%"

::pathwork
set sp=%origin%\..
cd %sp%

:run
node test
:end

echo Press any key to run test again (control+c to exit)
pause >nul

cls
goto :run

::logic
cmd \k
pause