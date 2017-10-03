var lib = require('./libServer');


module.exports.getOpreturn = function (req, res) {
    console.log("Params: " + req.params.opreturnHash);
    lib.rpcCall("getopreturn", [req.params.opreturnHash])
        .then(function (opreturn) {
            console.log("Get OP RETURN method response");
            console.log(opreturn);
            lib.sendRes(res, 200, opreturn);
        })
        .catch(function (err) {
            console.log("api getOpreturn: err:" + JSON.stringify(err));
        })
}