var fetchPromise = require('node-fetch');
var lib = require('./libServer');

module.exports.get = function (req, res) {
    lib.rpcCall("gettxoutsetinfo")
        .then(function (txoutsetinfo) {
            console.log("Get gettxoutsetinfo method response");
            console.log(txoutsetinfo);
            lib.sendRes(res, 200, txoutsetinfo);
        })
        .catch(function (err) {
            console.log("api gettxoutsetinfo: err:" + JSON.stringify(err));
            lib.sendRes(res, 404, { status: "error" });
        })
}
