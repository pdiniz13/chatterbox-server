exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  //console.log(newUser, 'this was passed in before the return')
  return req.session.regenerate(function(err) {
    //console.log(err);
    req.session.user = newUser;
    console.log(req.session.user, 'this is req.session.user');
    //console.log(newUser, 'this is newUser');
    res.redirect('/');
  });
};
