var fetchPromise = require('node-fetch');
var lib = require('./libServer');

module.exports.getAddress = function (req, res) {
    var socket = process.env.PHONENUMBERSOCKET + '/' + req.params.phoneNumber;
    console.log("Calling socket: " + socket);
    fetchPromise(socket)
        .then(function (response) {
            console.log("Socket " + socket + " called");
            return response.json();
        })
        .then(function(body) { 
            console.log(body);
            if(body.status == 'ok')
                lib.sendRes(res, 200, body);
            else
                lib.sendRes(res, 404, body);
        })
        .catch(function(error) {
            console.log("api getAddress: set err:" + JSON.stringify(err));
            lib.sendRes(res, 404, { status: "error" });
        })
}