SETLOCAL ENABLEDELAYEDEXPANSION

:: Read file "package.json" into variable string, removing line breaks.
set string=
for /f "delims=" %%x in ('findstr /c:"version" src\mxCoal\manifest.json') do set "string=!string!%%x"

rem Remove quotes
set string=%string:"=%
rem Remove braces
set "string=%string:~2,-2%"
rem Change colon+space by equal-sign
set "string=%string:: ==%"
rem Separate parts at comma into individual assignments
set "%string:, =" & set "%"

echo %version%

SET INI=build.ini
set DESTINATION=
set area=[Destination]
set key=folder
set currarea=
for /f "usebackq delims=" %%a in ("!INI!") do (
    set ln=%%a
    if "x!ln:~0,1!"=="x[" (
        set currarea=!ln!
    ) else (
        for /f "tokens=1,2 delims==" %%b in ("!ln!") do (
            set currkey=%%b
            set currval=%%c
            if "x!area!"=="x!currarea!" if "x!key!"=="x!currkey!" (
                set DESTINATION=%%c
            )
        )
    )
)
echo %DESTINATION%
mkdir %DESTINATION%

rmdir /s /q dist 
mkdir dist
cd dist

xcopy ..\src\mxCoal mxCoal /i /e
"C:\Program Files\7-Zip\7z.exe" a -r %DESTINATION%\mxcoal-%version%.zip mxCoal 
