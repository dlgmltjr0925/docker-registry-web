#!/bin/bash

data_dir_path='data'

if ! test -d $data_dir_path; then
  echo '$data_dir_path : Not found the directory'
  mkdir $data_dir_path
  cp ./scripts/prepare/docker-registry-ui.json ./data/
fi