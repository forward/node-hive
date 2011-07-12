#!/usr/bin/env bash

thrift -o node_modules --gen js:node -I src/hive-thrift src/hive-thrift/hive_metastore.thrift
thrift -o node_modules --gen js:node -I src/hive-thrift src/hive-thrift/hive_service.thrift 
thrift -o node_modules --gen js:node -I src/hive-thrift src/hive-thrift/fb303.thrift 
thrift -o node_modules --gen js:node -I src/hive-thrift src/hive-thrift/serde.thrift 
thrift -o node_modules --gen js:node -I src/hive-thrift src/hive-thrift/queryplan.thrift 
