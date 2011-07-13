Node Bindings for Hadoop Hive
=============================

Installation
------------

    npm install node-hive

Usage
-----

    hive = require('node-hive').for({ server:"hive.myserver" });
    
    hive.fetch("SELECT * FROM my_table", function(err, data) {
      data.each(function(record) {
        console.log(record);
      });
    });

Hive instances currently support the following functions

    hive.fetch(query, callback);
    hive.fetchInBatch(batchSize, query, callback);
    hive.execute(query, [callback]);

Query callbacks receive two arguments...

* `error` which is `true` if there was an error
* `result` which is either a `ResultSet` or an error message depending on the state of `error`

The result of a query is returned as a `ResultSet` which wraps the results with some convenience functions...

* `result.rows` - The original string based rows returned by thrift.
* `result.schema` - The schema returned from hive.
* `result.each(callback)` - Iterate through rows converting them to friendly JS objects.
* `result.headers()` - An Array of the column headers.
* `result.toTSV(headers=false)` - produce a TSV version of the whole ResultSet.


See the `examples` folder for some more usage hints. 


Connections
-----------

The Hive Thrift Server currently only supports one blocking query at a time. Due to the Async model of node we want to be able to run several queries at once, for this to work we create a new connection for each query to run in and then close it when the query is completed. There is currently no support for connection pooling as most users run a small number of long running hive queries but pooling should be possible if and when it's needed.


Notes
-----

Thrift module has been cloned from https://github.com/wadey/node-thrift/commit/25c0eb4eb85aa63cfb49a8e8c815bd57e2b8043a

nodejs bindinga are generated from hive 0.6.1 CDH3B4