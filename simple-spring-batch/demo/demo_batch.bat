chcp 65001
@echo off
color 0a
cls
title Blahblah v1.0
set jarFile=batch-job-0.0.1-SNAPSHOT.jar
:start
echo ---------------------------------------------------------------------------------------------------------------------------
echo							╔╗────╔╗───╔╗
echo							║║───╔╝╚╗──║║─────╔╗
echo							║╚═╦═╩╗╔╬══╣╚═╗───╚╬══╦╗╔╦══╗
echo							║╔╗║╔╗║║║╔═╣╔╗║───╔╣╔╗║╚╝║╔╗║
echo							║╚╝║╔╗║╚╣╚═╣║║║───║║╔╗╠╗╔╣╔╗║
echo							╚══╩╝╚╩═╩══╩╝╚╝───║╠╝╚╝╚╝╚╝╚╝
echo							─────────────────╔╝║
echo							─────────────────╚═╝
echo ---------------------------------------------------------------------------------------------------------------------------
ECHO 1. Run batch Example Job
ECHO 2. Run batch Second Job
ECHO 0. Exit

set choice=
set /p choice=Type the number to run Job:
if not '%choice%'=='' set choice=%choice%
if '%choice%'=='0' goto end
if '%choice%'=='1' (
	set jobName=exampleJob
	goto batch_runjob
)
if '%choice%'=='2' (
	set jobName=secondJob
	goto batch_runjob
)
ECHO "%choice%" is not valid, try again
ECHO.
goto start
REM "timeout 5 > nul"  ==> means not show message timeout

:batch_runjob
echo Running Job name: %jobName%
java -jar %jarFile% %jobName%
goto end

:end
pause
