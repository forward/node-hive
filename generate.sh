#!/usr/bin/env bash

thrift -o node_modules --gen js:node -I thrift thrift/hive_metastore.thrift
thrift -o node_modules --gen js:node -I thrift thrift/hive_service.thrift 
thrift -o node_modules --gen js:node -I thrift thrift/fb303.thrift 
thrift -o node_modules --gen js:node -I thrift thrift/serde.thrift 
thrift -o node_modules --gen js:node -I thrift thrift/queryplan.thrift 
