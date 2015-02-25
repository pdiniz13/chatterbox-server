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

//Message.sync().then(function () {
//   return Message.create({
//     username:'Rioa',
//     text: 'hello',
//     roomname: 'lobby'
//   });
//});


var url = require('url');

app.use(express.static(__dirname+'/client'));


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

app.listen(3000);