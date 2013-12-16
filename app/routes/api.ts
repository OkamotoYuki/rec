import jsonrpc = module('../api/jsonrpc')
import type = module('../api/type')
import runtime = module('../api/runtime')
import dshell = module('../api/dshell')

jsonrpc.add('version', function(params: any, callback: type.Callback) {
	callback.onSuccess('version 3.0');
});

jsonrpc.addModule(runtime);
jsonrpc.addModule(dshell);

export var httpHandler = jsonrpc.httpHandler;
