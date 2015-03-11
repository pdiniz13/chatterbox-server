var request = require('request');
var util = require('../lib/utility');
var controller = require('../lib/controller');
exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signUp');
};

exports.loginUserForm = function(req, res) {
  res.render('logIn');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.loginUser = function(req, res) {
  controller.validateUser(req, res);
};

exports.signupUser = function(req, res) {
  controller.createUser(req, res);
};