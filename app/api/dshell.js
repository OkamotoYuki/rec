
var error = require('./error');

function pushTestResult(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.filepath)
            checks.push('File path is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (params && !params.result)
            checks.push('Test result is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({ result_it: 0 });
}
exports.pushTestResult = pushTestResult;

function getTestResult(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({});
}
exports.getTestResult = getTestResult;

function getLatestTestResult(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({});
}
exports.getLatestTestResult = getLatestTestResult;

function getTestResultList(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess([]);
}
exports.getTestResultList = getTestResultList;

function getTestResultSeries(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess([]);
}
exports.getTestResultSeries = getTestResultSeries;

