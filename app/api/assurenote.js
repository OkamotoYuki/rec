var db = require('../db/db');

var error = require('./error');
var model_assurenote_monitor_items = require('../model/assurenote_monitor_items');
var model_assurenote_monitor_rawdata = require('../model/assurenote_monitor_rawdata');
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
    var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);
    var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);
    var timestamp = new Date();

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            monitorItemDAO.selectItem(params.type, params.location, function (err, monitor) {
                return next(err, monitor);
            });
        },
        function (monitor, next) {
            if (monitor) {
                next(null, monitor.monitor_id);
            } else {
                params['begin_timestamp'] = timestamp;
                params['latest_timestamp'] = timestamp;
                monitorItemDAO.insertItem(params, function (err, monitor_id) {
                    return next(err, monitor_id);
                });
            }
        },
        function (monitor_id, next) {
            monitorRawdataDAO.insertRawdata({ monitor_id: monitor_id, data: params.data, context: params.context, timestamp: timestamp }, function (err, monitor_id, rawdata_id) {
                return next(err, monitor_id, rawdata_id);
            });
        },
        function (monitor_id, rawdata_id, next) {
            monitorItemDAO.updateItem(monitor_id, rawdata_id, timestamp, function (err) {
                return next(err, rawdata_id);
            });
        },
        function (rawdata_id, next) {
            con.commit(function (err, result) {
                return next(err, rawdata_id);
            });
        }
    ], function (err, rawdata_id) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
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

    var con = new db.Database();
    var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            monitorRawdataDAO.getRawdata(params.rawdata_id, function (err, rawdata) {
                return next(err, rawdata);
            });
        },
        function (rawdata, next) {
            con.commit(function (err, result) {
                return next(err, rawdata);
            });
        }
    ], function (err, rawdata, next) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess(rawdata);
    });
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

    var con = new db.Database();
    var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);
    var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);
    var timestamp = new Date();

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            monitorItemDAO.selectItem(params.type, params.location, function (err, monitor) {
                return next(err, monitor);
            });
        },
        function (monitor, next) {
            monitorRawdataDAO.getRawdataWithMonitorInfo(monitor.latest_data_id, monitor, function (err, rawdata) {
                return next(err, rawdata);
            });
        },
        function (rawdata, next) {
            con.commit(function (err, result) {
                return next(err, rawdata);
            });
        }
    ], function (err, rawdata, next) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess(rawdata);
    });
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
    var con = new db.Database();
    var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            monitorItemDAO.getItemList(function (err, monitorList) {
                return next(err, monitorList);
            });
        },
        function (monitorList, next) {
            con.commit(function (err, result) {
                return next(err, monitorList);
            });
        }
    ], function (err, monitorList, next) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess(monitorList);
    });
}
exports.getMonitorList = getMonitorList;

