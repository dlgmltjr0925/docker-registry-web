#!/bin/bash

data_dir_path='data'

if ! test -d $data_dir_path; then
  echo '$data_dir_path : Not found the directory'
  mkdir $data_dir_path
  echo "created directory /data"
  cp ./scripts/prepare/docker-registry-web.json ./data/
  echo "copied default data"
fi