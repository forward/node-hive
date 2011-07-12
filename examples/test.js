hive = require('../node-hive').for({server:"hive.hadoop.forward.co.uk"});

hive.fetch("SELECT * FROM weather_data where dated = '2011-07-01' limit 10", function(err, data) {
  console.log("SELECT * FROM weather_data where dated = '2011-07-01' limit 10");
  console.log(data);
});

var i = 1;
hive.fetchInBatch(100, "SELECT * FROM weather_data where dated = '2011-07-02' limit 1002", function(err, data) {
  console.log("SELECT * FROM weather_data where dated = '2011-07-02'");
  console.log(i++ + "th data:", data);
});

hive.execute("DESCRIBE weather_data", function(err, data) {
  console.log("DESCRIBE weather_data");
  console.log(data);
});
