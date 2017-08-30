var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var passport = require('passport');
var lib = require('./libServer');

//C
module.exports.addUser = function (req, res) {
  User.create(req.body,
    function (err, user) {
      if (err) {
        console.log("api setUser: set err:" + JSON.stringify(err));
        lib.sendRes(res, 404, { status: "error" });
        return;
      }
      console.log("api setUser: get ok ");
      lib.sendRes(res, 200, user);
    });
}

//R
module.exports.getUser = function (req, res) {
  User.find().exec(function (err, user) {
    if (err) {
      console.log("api getUser: get err:" + JSON.stringify(err));
      lib.sendRes(res, 500, { status: "error" });
      return;
    }
    console.log("api getUser: get ok ");
    lib.sendRes(res, 200, user);
  });
}

//U
module.exports.updateUser = function (req, res) {
  User
    .findById(req.body._id,
    function (err, user) {
      if (err) {
        console.log("api updateUser_exec: err:" + JSON.stringify(err));
        lib.sendJsonMessage(res, 400, err);
        return;
      }
      for (key in req.body) {
        user[key] = req.body[key];
      }
      user.save(function (err, user) {
        if (err) {
          console.log("api updateUser_save: err:" + JSON.stringify(err));
          lib.sendRes(res, 404, err);
          return;
        }
        console.log("api updateUser_save: ok");
        lib.sendRes(res, 200, user);
      });
    });
};

//D
module.exports.deleteUser = function (req, res) {
  User
    .findByIdAndRemove(req.params._id)
    .exec(
    function (err, data) {
      if (err) {
        console.log("api deleteUser: err:" + JSON.stringify(err));
        lib.sendRes(res, 404, err);
        return;
      }
      console.log("api deleteUser: ok");
      lib.sendRes(res, 200, { "message": data });
    }
    );
};

//Register
module.exports.register = function (req, res) {
  if (!req.body.username || !req.body.password) {
    lib.sendRes(res, 400, { "message": "All fields required" });
    return;
  }
  var user = new User();
  user.username = req.body.username;
  var salt = crypto.randomBytes(16).toString('hex');
  user.salt = salt;
  user.hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64,'sha256').toString('hex');
  user.save(function (err) {
    if (err) {
      lib.sendRes(res, 404, err);
      return;
    }
    lib.sendRes(res, 200, { "token": lib.generateJwt(user) });
  });
}

//Login
module.exports.login = function (req, res) {
  if (!req.body.username || !req.body.password) {
    lib.sendRes(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  passport.authenticate('user-local', function (err, user, info) {
    if (err) {
      lib.sendRes(res, 404, err);
      return;
    }
    if (user) {
      lib.sendRes(res, 200, { "token": lib.generateJwt(user) });
      return;
    }
    lib.sendRes(res, 401, info);
  })(req, res);
};