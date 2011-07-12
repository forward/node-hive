var thrift = require('thrift'),
    ttransport = require('thrift/transport'),
    ThriftHive = require('gen-nodejs/ThriftHive');

var connection = thrift.createConnection("hive.hadoop.forward.co.uk", 10000, {transport: ttransport.TBufferedTransport, timeout: 1*1000});
var client = thrift.createClient(ThriftHive, connection);
var done = false;

connection.on('error', function(err){ console.error(err); });

var run_test = function(conn, client, query, wait, callback) {
  var func = function(){
    console.log("executing.");
    client.execute(query, function(err){
      console.log("executed.");
      if (err){ console.error("error on execute():", err); }
      
      client.fetchAll(function(err, data){
        console.log("fetched.");
        if (err){ console.error("error on fetchAll():", err); }

        console.log("result:", data);
        callback();
      });
    });
  };
  conn.addListener("connect", function(){
    console.log("connected.");
    setTimeout(func, wait);
  });
};

var query = "select count(1) from ask_hourly_clicks where country = 'mx' and dated = '2011-07-11'";
run_test(connection, client, query, 5000, function(){ done = true; });

setInterval(function(){
  if (done){
    connection.end();
    process.exit(0);
  }
}, 1000);
