#!/bin/sh
rm -rf ./server/public
rm -rf ./server/dist
cd client
(yarn build ) || (npm run build )
cp -r ./dist ../server/public
cd ..
cd server
(yarn tsc ) || (npm run tsc )
node .