
var error = require('./error');

function pushRawData(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.type)
            checks.push('Monitor type is required.');
        if (params && !params.location)
            checks.push('Monitor location is required.');
        if (params && !params.data)
            checks.push('Monitor data is required.');
        if (params && !params.auth_id)
            checks.push('Auth ID is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({ rawdata_id: 0 });
}
exports.pushRawData = pushRawData;

function getRawData(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.rawdata_id)
            checks.push('Rawdata ID is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });
}
exports.getRawData = getRawData;

function getLatestData(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.type)
            checks.push('Monitor type is required.');
        if (params && !params.location)
            checks.push('Monitor location is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });
}
exports.getLatestData = getLatestData;

function getRawDataList(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.type)
            checks.push('Monitor type is required.');
        if (params && !params.location)
            checks.push('Monitor location is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    callback.onSuccess([]);
}
exports.getRawDataList = getRawDataList;

function getMonitorList(params, callback) {
    callback.onSuccess([]);
}
exports.getMonitorList = getMonitorList;

