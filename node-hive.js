var thrift = require('thrift'),
    ttransport = require('thrift/transport'),
    ThriftHive = require('gen-nodejs/ThriftHive');

var futureConnection = function(config) {
  return function(cb) {
    var connection = thrift.createConnection(config.server, config.port || 10000, {transport: ttransport.TBufferedTransport, timeout: config.timeout || 1000});
    var client = thrift.createClient(ThriftHive, connection);
    cb(client, connection);
  };
};

var hiveClient = function(futureConnection) {
  return {
    fetch: function(query, cb) {
      futureConnection(function(client, connection) {
        client.execute(query, function(err){
          if (err) return cb(true, err);
          client.fetchAll(function(err, data){
            if (err) return cb(true, err);
            cb(null, data);
            connection.end();
          });
        });
      })
    },
    
    execute: function(query, cb){
      futureConnection(function(client, connection) {
        client.execute(query, function(err){
          if (err) return cb(true, err);
          cb(null, null);
          connection.end();
        });
      });
    },
  };
};

exports.for = function(config) {
  return hiveClient(futureConnection(config));
};
