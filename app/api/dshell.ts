import type = module('./type')
import error = module('./error');

export function pushTestResult(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.filepath) checks.push('File path is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(params && !params.result) checks.push('Test result is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ result_it: 0 });    // FIXME
}

export function getTestResult(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({});    // FIXME
}

export function getLatestTestResult(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({});    // FIXME
}

export function getTestResultList(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess([]);    // FIXME
}

export function getTestResultSeries(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess([]);    // FIXME
}
