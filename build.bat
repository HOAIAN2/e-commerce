@ECHO OFF
RMDIR /s /q .\server\public
RMDIR /s /q .\server\dist
CD client
( CALL yarn build ) || ( CALL npm run build )
XCOPY ".\dist" "..\server\public" /h /i /c /k /e /r /y
CD ..
CD server
( CALL yarn tsc ) || ( CALL npm run tsc )
CALL node .