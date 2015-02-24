var express = require('express');
var app = express();
var request = require('request');
var url = require('url');
var dataArr = {results: [{username:'Rioa', text: 'hello', roomname: 'lobby', createdAt: 'Mon Feb 23 2015 16:43:01 GMT-0800'},
  {username:'Rioa', text: 'hello', roomname: 'lobby', createdAt: 'Mon Feb 23 2015 16:43:01 GMT-0800'},
  {username:'Rioa', text: 'hello', roomname: 'lobby', createdAt: 'Mon Feb 23 2015 16:43:01 GMT-0800'},
  {username:'Rioa', text: 'hello', roomname: 'lobby', createdAt: 'Mon Feb 23 2015 16:43:01 GMT-0800'},
]};

app.use(express.static(__dirname+'/client'));

//app.get('/', function(req, res) {
//  res.sendFile(__dirname+'/client');
//});

//res.sendFile(path.join(__dirname, '../public', 'index1.html'));
//res.sendFile('index1.html', { root: path.join(__dirname, '../public') });

var dataParser = function(order, where, limit){
  var returnArr = [];
  var room = JSON.parse(where).roomname;
  var limit = parseInt(limit);
  if(order === '-createdAt'){
    var x = dataArr.results.length - 1;
    while(limit >= returnArr.length && x >= 0){
      if(dataArr.results[x].roomname === room || room === 1 ){
        returnArr.push(dataArr.results[x]);
      }
      x--;
    }
  }
  return returnArr;
};

/**
 * Get request from client for initial data.
 */
app.get('/classes/messages', function(req, res) {
  var order = req.query.order;
  //console.log("Created: ", order);
  var where = req.query.where;
  //console.log("Where: ", where);
  var limit = req.query.limit;
  //console.log("Limit: ", limit);
  var newDataArr = {results: dataParser(order, where, limit)};
  //console.log(newDataArr);
  res.end(JSON.stringify(newDataArr));
});



app.post('/classes/messages', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    //console.log("data", typeof data);
    //console.log("data parse", JSON.parse(data));
    var newData = JSON.parse(data);
    newData.createdAt = new Date();
    dataArr.results.push(newData);
    //console.log(dataArr.results);
    //var responseObj = {"success" : "Updated Successfully", "status" : 200};
    //response.writeHead(statusCode, headers);
    //response.end(JSON.stringify(responseObj));
    //response.end();
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});

app.listen(3000);







var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = "127.0.0.1";