/**
 * Created by ppp on 3/10/2015.
 */
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var utility = require('../lib/utility.js');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true,
  database: 'Chatterbox'
});

var validateUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var options = {sql: "SELECT password FROM user where username = " + username};
  connection.query(options, function(err, result) {
    if (err) {
      console.log('there was a connection error ', err)
    }
    bcrypt.compare(result, hash, function(err, res) {
      if (err) {
        console.log('there was a bcrypt error', err);
      }
      if (!res) {
        res.redirect('/login');
      } else {
        //console.log(username, 'user was validated');
        utility.createSession(req, res, username);
      }
    });
  });
};
exports.validateUser = validateUser;

var createUser = function(req, res) {
  var userName = req.body.username;
  var FName = req.body.FName;
  var LName = req.body.LName;
  var password = req.body.password;
  bcrypt.hash(password, null, null, function(error, hash) {
    var options = {sql: 'SET @A:=' + '"' + userName + '"' + '; SET @B:=' + '"' + FName + '"' + '; SET @C:=' + '"' + LName + '"' + '; SET @D:=' + hash + '; CALL insertNewUser(@A, @B, @C, @D);'};
    connection.query(options, function(err, results) {
      if (error) {
        console.log("bcrypt had an error at signup")
      }
      if (err) {
        console.log('There was a database error at signup, it was: ', err);
        req.redirect('/signup');
      } else {
        //console.log('Able to sign-up');
        res.redirect('/login');
      }
    })
  })
};

exports.createUser = createUser;

var selectMessages = function(req, res) {
  var where = req.query.where || "lobby";
  var options = {sql: 'SET @A:=' + '"' + where + '"' + '; CALL selectMessages(@A)'};
  connection.query(options, function(err, results) {
    console.log(results[1]);
    res.end(JSON.stringify(results[1]));
    console.log(err);
  });
};
exports.selectMessages = selectMessages;

var addMessages = function(req, res) {
  var options = {sql: 'SET @A:=' + '"' + req.body.message + '"' + '; SET @B:=' + '"' + req.body.userName + '"' + '; SET @C:=' + '"' + req.body.roomName + '"' + '; SET @D:=1234; CALL insertIntoMessages(@A, @B, @C);'};
  connection.query(options, function(err, results) {
    console.log(err);
  });
  res.status(200);
  res.writeHead(200);
  res.end(JSON.stringify({ObjectID: 1}));
};
exports.addMessages = addMessages;

var selectFriends = function(req, res) {
  var username = req.query.username;
  var options = {sql: 'SET @A:=' + '"' + username + '"' + '; CALL Chatterbox.selectFriend(@A);'};
  connection.query(options, function(err, results) {
    console.log(results[1]);
    res.end(JSON.stringify(results[1]));
    console.log(err);
  })
};
exports.selectFriends = selectFriends

var addFriends = function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var options = {sql: 'SET @A:=' + '"' + req.body.message + '"' + '; SET @B:=' + '"' + req.body.userName + '"' + '; SET @C:=' + '"' + req.body.roomname + '"' + '; SET @D:=1234; CALL insertIntoMessages(@A, @B, @C);'};
    connection.query(options, function(err, results) {
      console.log(err);
    });
    res.redirect('/index')
  });
};
exports.addFriends = addFriends;

var addRoom = function(req, res) {
  var options = {sql: 'SET @A:=' + '"' + req.body.username + '"' + '; SET @B:=' + '"' + req.body.roomname + '"' + '; CALL createRoom(@A, @B);'};
  connection.query(options, function(err, results) {
    if (err) {
      console.log("room already exists")
    }
    res.redirect('/index');
  });
};
exports.addRoom = addRoom;

var roomsAvailable = function(req, res) {
  var username = req.query.username;
  var options = {sql: 'SET @A:=' + '"' + username + '"' + '; CALL selectRooms(@A)'};
  connection.query(options, function(err, results) {
    res.end(JSON.stringify(results[1]));
    console.log(err);
  });
};
exports.roomsAvailable = roomsAvailable;

var addRoomsAllowed = function(req, res) {
  var options = {sql: 'SET @A:=' + '"' + req.body.username + '"' + '; SET @B:=' + '"' + req.body.roomname + '"' + '; CALL insertRoomAllowed(@A, @B);'};
  connection.query(options, function(err, results) {
    res.redirect('/index');
  })
};
exports.addRoomsAllowed = addRoomsAllowed;