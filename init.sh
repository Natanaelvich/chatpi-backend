#!/bin/sh
./node_modules/.bin/typeorm migration:run
node dist/shared/infra/http/server.js
