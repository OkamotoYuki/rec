var jsonrpc = require('../api/jsonrpc');

var runtime = require('../api/runtime');
var dshell = require('../api/dshell');

jsonrpc.add('version', function (params, callback) {
    callback.onSuccess('version 3.0');
});

jsonrpc.addModule(runtime);
jsonrpc.addModule(dshell);

exports.httpHandler = jsonrpc.httpHandler;

