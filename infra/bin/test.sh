#!/usr/bin/env bash

set -e
set -x


script_path=$(realpath $0)
script_dir=$(dirname $script_path)

# Load come common methods shared by all scripts
common_funcs="$script_dir/common_funcs.sh"
. $common_funcs

# Check for required ENVs
missing=$(missing_args CF_DIR )
if [ "$missing" != "" ]; then
  echo "The following environment variables must be set: $missing"
  exit 1
fi


for f in $(find "$CF_DIR" -name \*.yaml ); do
    AWS_PAGER="" aws cloudformation validate-template --template-body file://$f
done