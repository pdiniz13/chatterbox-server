var express = require('express');
var app = express();
var request = require('request');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: 'database.sqlite'
});

var Message = sequelize.define('message', {
  text: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  },
  roomname: {
    type: Sequelize.STRING
  }

});

var Friends = sequelize.define('friends', {
  username: {
    type: Sequelize.STRING
  },
  friend: {
    type: Sequelize.STRING
  }

});

Friends.sync({force:true}).then(function () {
   return Friends.create({
     username:'Pdiniz',
     friend: 'Rioa'
   });
});

Message.sync({force:true}).then(function () {
  return Message.create({
    username:'Pdiniz',
    text: 'Hello',
    roomname: 'lobby'
  });
});


var url = require('url');

app.use(express.static(__dirname+'/public/client'));


/**
 * Get request from client for initial data.
 */
app.get('/classes/messages', function(req, res){
  var order = req.query.order;
  console.log("Created: ", order);
  var where = req.query.where || "lobby";
  console.log("Where: ", where);
  var limit = req.query.limit || 100;
  Message.findAll({limit: limit, order: 'createdAt DESC', where: {roomname: where}}).then(function(messages) {
    res.end(JSON.stringify(messages));
  });
});

app.get('/classes/friends', function(req, res){
  var username = req.query.username;
  Friends.findAll({where: {username: username}}).then(function(friends) {
    res.end(JSON.stringify(friends));
  });
});



app.post('/classes/messages', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    var newData = JSON.parse(data);


    Message.sync().then(function () {
      return Message.create({
        username: newData.username,
        text: newData.text,
        roomname: newData.roomname
       });
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
    Friends.sync().then(function () {
      return Friends.create({
        username: newData.username,
        friend: newData.friend
      });
    });
    res.status(200);
    res.writeHead(200);
    res.end(JSON.stringify({ObjectID: 1}));
  });
});

app.listen(process.env.port || 8080);