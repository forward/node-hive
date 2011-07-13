var thrift = require('thrift'),
    ttransport = require('thrift/transport'),
    ThriftHive = require('gen-nodejs/ThriftHive'),
    ResultSet = require('./result_set');

var hiveClient = function(config) {
  var connect = function(onError, connected) {
    var server = config.server;
    var port = config.port || 10000;
    var options = {transport: ttransport.TBufferedTransport, timeout: config.timeout || 1000};
    
    var connection = thrift.createConnection(server, port, options);
    var client = thrift.createClient(ThriftHive, connection);
    
    connected({
      execute: function(query, onSuccess) {
        client.execute(query, function(err) {
          if (err) {
            connection.end();
            onError(true, err);
          } else {
            onSuccess();
          }
        });
      },
      getSchema: function(onSuccess) {
        client.getSchema(function(err, schema) {
          if (err) {
            connection.end();
            onError(true, err);
          } else {
            onSuccess(schema);
          }
        });
      },
      fetchAll: function(onSuccess) {
        client.fetchAll(function(err, data) {
          if (err) {
            connection.end();
            onError(true, err);
          } else {
            onSuccess(data);
          }
        });
      },
      fetchN: function(batchSize, onSuccess) {
        client.fetchN(batchSize, function(err, data) {
          if (err) {
            connection.end();
            onError(true, err);
          } else {
            onSuccess(data);
          }
        });
      },
      closeConnection: function() {
        connection.end();
      }
    });
  };
  
  return {
    fetch: function(query, onCompletion) {
      connect(onCompletion, function(client) {
        client.execute(query, function() {
          client.getSchema(function(schema) {
            client.fetchAll(function(data) {
              client.closeConnection();
              onCompletion(null, ResultSet.create(data, schema));
            });
          });
        });
      });
    },
    
    fetchInBatch: function(batchSize, query, onCompletion) {
      connect(onCompletion, function(client) {
        client.execute(query, function() {
          client.getSchema(function(schema) {
            var fetchBatch = function() {
              client.fetchN(batchSize, function(data) {
                if(data.length > 0) {
                  onCompletion(null, ResultSet.create(data, schema));
                  process.nextTick(fetchBatch);
                } else {
                  client.closeConnection();
                }
              });
            };
            fetchBatch();
          });
        });
      });
    },
    
    execute: function(query, onCompletion){
      connect(onCompletion, function(client) {
        client.execute(query, function(){
          client.closeConnection();
          onCompletion(null, null);
        });
      });
    },
  };
};

exports.for = function(config) {
  return hiveClient(config);
};
