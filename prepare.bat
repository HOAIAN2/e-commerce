@ECHO OFF
CALL node random
CD server
( CALL yarn install ) || ( CALL npm i )
CD ../client
( CALL yarn install)  || ( CALL npm i )