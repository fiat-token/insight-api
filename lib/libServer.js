var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var fetch = require('node-fetch');

module.exports.sendRes = function (res, status, content) {
        res.status(status); 
        res.json(content);
};

module.exports.validPassword = function (hash, salt, password) {
        return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex'); 
};

module.exports.generateJwt = function (user) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        return jwt.sign({
            _id: user._id,
            username: user.username,
            exp: parseInt(expiry.getTime() / 1000)            
        }, process.env.JWT_SECRET);
    };

module.exports.rpcCall = function (method, param) {
        var user = 'bitcoin';
        var pass = 'local321';
        var socket = "http://127.0.0.1:18332";
        var header = {'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64')}; 
        var bodyJSON =
                {
                        method: method,
                        params: param
                }
        var body = JSON.stringify(bodyJSON);
        return fetch(socket, { method: 'POST', headers: header, body: body })
                .then(function (res) { return res.json(); })
                .catch(function (err) { console.log("ERROR: fetch-" + method + ": " + err) });
}