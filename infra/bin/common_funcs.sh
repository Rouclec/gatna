#!/usr/bin/env bash



# Check for required ENVs
missing_args(){
  missing=""
  for k in $@; do
    v=$(eval "echo \$$k")
    if [ -z "$v" ]; then
      missing="$k $missing"
    fi
  done
  echo "$missing"
}

list_target_branches(){
  env_file=$1
  
   (yq e '.gitRefName' $env_file; yq e '.environments[] | .gitRefName' $env_file) | sort | uniq
  
}

get_target_branch(){
  env_file=$1
  yq e '.gitRefName' $env_file  
}


list_system_files(){
  script_path=$(realpath $0)
  script_dir=$(dirname $script_path)
  environments_file=$(realpath "$script_dir/../environments.yaml")
   num_systems=$(yq e '.| length' "$environments_file")

  for (( i=0; i<$num_systems; i++ )); do
      system_file="system_$i.yaml" # $(mktemp)
      yq e ".[$i]" "$environments_file" > "$system_file"
      echo "$system_file"
    done
}