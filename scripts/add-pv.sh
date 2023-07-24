#!/bin/bash

set -x

# add pv to markdown / replace link
files=`find ./docs/speeches -name '*.md' | grep -v 'index.md'`
for file in ${files[@]}
do 
    filename=$(basename $file)
    sed -i '/#/a\<img class="pv" src="https://api.visitor.plantree.me/visitor-badge/pv?namespace=plantree.me&key=renzhengfei-speeches/'${filename}'">\n' ${file}
    sed -i '1s/##/#/' ${file}
done