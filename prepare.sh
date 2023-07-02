#!/bin/sh
node random.js
cd ./server
(yarn install) || (npm install)
mkdir -p ./static/avatars
cd ../client
(yarn install) || (npm install)