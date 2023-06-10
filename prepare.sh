#!/bin/sh
node random.js
cd ./server
(yarn install) || (npm install)
cd ../client
(yarn install) || (npm install)