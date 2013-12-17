var db = require('../db/db');

var error = require('./error');
var model_runtime_monitors = require('../model/runtime_monitors');
var model_runtime_rawdata = require('../model/runtime_rawdata');
var async = require('async');

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

    var con = new db.Database();
    var runtimeMonitorDAO = new model_runtime_monitors.RuntimeMonitorDAO(con);
    var runtimeRawdataDAO = new model_runtime_rawdata.RuntimeRawdataDAO(con);
    var timestamp = new Date();

    async.waterfall([
        function (next) {
            runtimeMonitorDAO.get(params.type, params.location, params.auth_id, function (err, monitor) {
                return next(err, monitor);
            });
        },
        function (monitor, next) {
            if (monitor) {
                next(null, monitor.monitor_id);
            } else {
                params['begin_timestamp'] = timestamp;
                params['latest_timestamp'] = timestamp;
                runtimeMonitorDAO.insert(params, function (err, monitor_id) {
                    return next(err, monitor_id);
                });
            }
        },
        function (monitor_id, next) {
            runtimeRawdataDAO.insert({ monitor_id: monitor_id, data: params.data, context: params.context, timestamp: timestamp }, function (err, monitor_id, rawdata_id) {
                return next(err, monitor_id, rawdata_id);
            });
        },
        function (monitor_id, rawdata_id, next) {
            runtimeMonitorDAO.update(monitor_id, rawdata_id, timestamp, function (err) {
                return next(err, rawdata_id);
            });
        }
    ], function (err, rawdata_id) {
        con.close();
        if (err) {
            callback.onFailure(err);
            return;
        }
        callback.onSuccess({ rawdata_id: rawdata_id });
    });
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

