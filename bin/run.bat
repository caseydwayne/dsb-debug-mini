@echo off
title=Proto Build Server
::setup
set origin="%CD%"

::pathwork
set sp=%origin%\..
cd %sp%

::logic
node run
pause