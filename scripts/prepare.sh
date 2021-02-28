#!/bin/bash
mkdir data
cp ./scripts/prepare/docker-registry-ui.db ./data/

node ./scripts/prepare/database.js