@ECHO OFF
CALL node random
CD server
( CALL yarn install ) || ( CALL npm i )
IF NOT EXIST .\static\avatars MKDIR .\static\avatars
CD ../client
( CALL yarn install)  || ( CALL npm i )