del /q %DEPLOYMENT_TARGET%\*
for /d %%x in (%DEPLOYMENT_TARGET%\*) do @rd /s /q "%%x"
IF "%ERRORLEVEL%" NEQ "0" goto error

:: Временно закомментировал для ускорения деплоя
::del /q %DEPLOYMENT_SOURCE%\node_modules\*
::for /d %%x in (%DEPLOYMENT_SOURCE%\node_modules\*) do @rd /s /q "%%x"
::IF "%ERRORLEVEL%" NEQ "0" goto error
::
::del /q %DEPLOYMENT_SOURCE%\dev\bower_components\*
::for /d %%x in (%DEPLOYMENT_SOURCE%\dev\bower_components\*) do @rd /s /q "%%x"
::IF "%ERRORLEVEL%" NEQ "0" goto error

pushd "%DEPLOYMENT_SOURCE%"

call npm install --no-optional
IF "%ERRORLEVEL%" NEQ "0" goto error

call node node_modules/gulp/bin/gulp release
IF "%ERRORLEVEL%" NEQ "0" goto error

xcopy %DEPLOYMENT_SOURCE%\release %DEPLOYMENT_TARGET% /Y /E
IF "%ERRORLEVEL%" NEQ "0" goto error

goto end

:: Не понял практическую пользу, временно закомментировал
:::ExecuteCmd
::setlocal
::set _CMD_=%*
::call %_CMD_%
::if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
::exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.  
call :exitSetErrorLevel  
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal  
echo Finished successfully.