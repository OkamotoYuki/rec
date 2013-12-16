import type = module('./type')
import error = module('./error');

export function pushRawData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(params && !params.data) checks.push('Monitor data is required.');
		if(params && !params.auth_id) checks.push('Auth ID is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ rawdata_id: 0 });    // FIXME
}

export function getRawData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.rawdata_id) checks.push('Rawdata ID is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });    // FIXME
}

export function getLatestData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });    // FIXME
}

export function getRawDataList(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess([]);    // FIXME
}

export function getMonitorList(params: any, callback: type.Callback) {
	// TODO
	callback.onSuccess([]);    // FIXME
}
