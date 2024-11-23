#!/usr/bin/env bash


# exit on error
set -e

script_path=$(realpath $0)
script_dir=$(dirname $script_path)

# Load come common methods shared by all scripts
common_funcs="$script_dir/common_funcs.sh"
source $common_funcs

# Check for required ENVs
missing=$(missing_args "GITHUB_SHA" CF_DIR ARTIFACTS_STACK_NAME )
if [ "$missing" != "" ]; then
  echo "The following environment variables must be set: $missing"
  exit 1
fi



cf_path=$(realpath $CF_DIR)
bucket_name=$(aws cloudformation describe-stacks --stack-name "$ARTIFACTS_STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='InfraArtifactsBucket'].OutputValue" --output text )



upload_file(){
    do_upload cp $@
}

upload_dir(){
    do_upload sync $@
}

do_upload(){
    cmd=$1
    artifact_path=$2
    hash=$3
    bucket_name=$4
    artifact_name=$(basename $artifact_path)
    aws s3 "$cmd" $artifact_path s3://$bucket_name/$artifact_name/$hash
}



echo upload_dir $cf_path $GITHUB_SHA $bucket_name
upload_dir $cf_path $GITHUB_SHA $bucket_name