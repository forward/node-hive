hive = require('../node-hive').for({server:"hive.hadoop.forward.co.uk", timeout:10000});

hive.fetch("SELECT * FROM weather_data where dated = '2011-07-01' limit 10", function(err, data) {
  console.log("SELECT * FROM weather_data where dated = '2011-07-01' limit 10");
  data.each(function(record) {
    console.log(record);
  });
});

var i = 1;
hive.fetchInBatch(5, "SELECT * FROM weather_data where dated = '2011-07-02' limit 12", function(err, data) {
  console.log("SELECT * FROM weather_data where dated = '2011-07-02' limit 12");
  console.log(i++ + "th data:", data.toTSV());
}, function() {
  console.log("fetchInBatch completed")
});

hive.execute("DESCRIBE weather_data", function(err, data) {
  console.log("DESCRIBE weather_data");
  console.log(data);
});
