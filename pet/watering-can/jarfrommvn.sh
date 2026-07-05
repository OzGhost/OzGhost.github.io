#!/bin/bash
gid=$1
artifact=$2
version=$3
if [[ -z $gid || -z $artifact || -z $version ]]
then
    echo "usage: $0 <groupid> <artifactid> <version>"
    exit 1
fi
gid=$(echo $gid | sed -e 's|\.|\/|g')
host='https://repo1.maven.org/maven2'
url=$host"/"$gid"/"$artifact"/"$version"/"$artifact"-"$version".jar"
echo $url
curl -vO $url
