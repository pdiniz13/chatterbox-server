var express = require('express');
var password = require('./protection');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true,
  database: 'Chatterbox'
});

var request = require('request');

var authenticated = false;



var url = require('url');

app.use(express.static(__dirname + '/public/client'));

/**
 * Get request from client for initial data.
 */

app.get('/classes/messages', function(req,res){
  var where = req.query.where || "lobby";
  var options = {sql: 'SET @A:=' + '"' + where + '"' + '; CALL selectMessages(@A)'};
  connection.query(options, function(err, results){
    console.log(results[1]);
    res.end(JSON.stringify(results[1]));
    console.log(err);
  });
});



app.get('/classes/friends', function(req, res){
  var username = req.query.username;
  var options = {sql: 'SET @A:=' + '"' + username + '"' + '; CALL Chatterbox.selectFriend(@A);'};
  connection.query(options, function(err, results){
    console.log(results[1]);
    res.end(JSON.stringify(results[1]));
    console.log(err);
  });
});



app.post('/classes/messages', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    //we might not need line 136
    var options = {sql: 'SET @A:=' + '"' + newData.message + '"' + '; SET @B:='+ '"' + newData.userName + '"' + '; SET @C:=' + '"' + newData.roomName + '"' + '; SET @D:=1234; CALL insertIntoMessages(@A, @B, @C);'};
    connection.query(options, function(err, results){
      //res.end(JSON.stringify(results[1]));
      console.log(err);
    });
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});




app.post('/classes/friends', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    //we might not need 157
    var options = {sql: 'SET @A:=' + '"' + newData.message + '"' + '; SET @B:='+ '"' + newData.userName + '"' + '; SET @C:=' + '"' + newData.roomname + '"' + '; SET @D:=1234; CALL insertIntoMessages(@A, @B, @C);'};
    connection.query(options, function(err, results){
      //res.end(JSON.stringify(results[1]));
      console.log(err);
    });
    //Friends.sync().then(function () {
    //  return Friends.query('SET @A:=' + "'" + newData.username + "'" + '; SET @B:=' + "'" +  newData.friendId + "'" +  '; CALL createFriend(@A, @B);');
    //});
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});


app.post('/classes/addUser', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    var password = password.hex_md5(newData.password);

    var options = {sql: 'SET @A:=' + '"' + newData.userName + '"' + '; SET @B:=' + '"' + newData.FName + '"' + '; SET @C:='+ '"' + newData.LName + '"' + '; SET @D:=' + password + '; CALL insertNewUser(@A, @B, @C, @D);'};
    connection.query(options, function(err, results){
      res.end(JSON.stringify(results[1]));
      console.log(err);
      if (!!err){
        res.writeHead(303, {location: 'index.html'});
        res.end(JSON.stringify({"username": newData.userName, "authenticated": true}))
      }
      else{
        res.writeHead(201, {location: 'loading.html'});
        res.end(JSON.stringify({"message": 'UserName is take please just another one'}))
      }
    });
    //User.sync().then(function () {
    //  return Message.query('SET @A:=' + "'" + newData.userName + "'" + '; SET @B:=' + "'" + newData.FName + "'" + '; SET @C:='+ "'" + newData.LName + "'" + '; SET @D:=' + password + '; CALL insertNewUser(@A, @B, @C, @D);')
    //});
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});

app.post('/classes/authenticate', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    var password = password.hex_md5(newData.password);

    var options = {sql: 'SET @A:=' + '"' + newData.userName + '"' + '; SET @B:=' + '"' + newData.FName + '"' + '; SET @C:='+ '"' + newData.LName + '"' + '; SET @D:=' + password + '; CALL insertNewUser(@A, @B, @C, @D);'};
    connection.query(options, function(err, result){
      if (password === result) {
        authenticated = true;
        res.end(JSON.stringify({validation: true}));
      }
      else {
        authenticated = false;
        res.end(JSON.stringify({validation: false}));
      }
      console.log(err);
    });
    //User.sync().then(function() {
    //  return Message.query('SELECT password FROM user WHERE username = ' + '"' + newData.username + '"', {type: sequelize.QueryTypes.SELECT}).then(function(validatePassword) {
    //    if (password === validatePassword) {
    //      authenticated = true;
    //      res.end(JSON.stringify({validation: true}));
    //    }
    //    else {
    //      authenticated = false;
    //      res.end(JSON.stringify({validation: false}));
    //    }
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});

app.post('/classes/addRoom', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    var options = {sql: 'SET @A:=' + '"' + newData.username + '"' + '; SET @B:=' + '"' + newData.roomname + '"' + '; CALL createRoom(@A, @B);'};
    connection.query(options, function(err, results){
      res.end(JSON.stringify(results[1]));
      console.log(err);
    });
    //Message.sync().then(function () {
    //  return Message.query('SET @A:=' + "'" + newData.username + "'" + '; SET @B:=' + "'" + newData.roomname + "'" + '; CALL createRoom(@A, @B);')
    //});
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});

app.get('/classes/rooms', function(req, res){
  var username = req.query.username;
  var options = {sql: 'SET @A:=' + '"' + username + '"' + '; CALL selectRooms(@A)'};
  connection.query(options, function(err, results){
    res.end(JSON.stringify(results[1]));
    console.log(err);
  });
  //Rooms.query('').then(function(rooms) {
  //  res.end(JSON.stringify(rooms));
  //});
});

app.post('/classes/addRoomAllowed', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);
    var options = {sql: 'SET @A:=' + '"' + newData.username + '"' + '; SET @B:=' + '"' + newData.roomname + '"' + '; CALL insertRoomAllowed(@A, @B);'};
    connection.query(options, function(err, results){
      res.end(JSON.stringify(results[1]));
      console.log(err);
    });
    //Rooms.sync().then(function () {
    //  return Rooms.query('SET @A:=' + "'" + newData.username + "'" + '; SET @B:=' + "'" + newData.roomname + "'" + '; CALL insertRoomAllowed(@A, @B);')
    //});
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});




app.listen(8080);
//app.listen(process.env.port || 8080);