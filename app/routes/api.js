var jsonrpc = require('../api/jsonrpc');

var assurenote = require('../api/assurenote');
var dshell = require('../api/dshell');

jsonrpc.add('version', function (params, callback) {
    callback.onSuccess('version 3.0');
});

jsonrpc.addModule(assurenote);
jsonrpc.addModule(dshell);

exports.httpHandler = jsonrpc.httpHandler;

