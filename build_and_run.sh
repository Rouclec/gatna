#!/bin/sh 

set -e

cd /app

export NEXT_TELEMETRY_DISABLED=1

export NODE_ENV=production

# search ad replace all dummy environment variables
node  search_and_replace_env.js

docker-entrypoint.sh node server.js