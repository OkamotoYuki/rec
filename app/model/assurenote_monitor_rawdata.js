var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var model_assurenote_monitor_items = require('./assurenote_monitor_items');
var async = require('async');

var MonitorRawdata = (function () {
    function MonitorRawdata(rawdata_id, data, context, timestamp) {
        this.rawdata_id = rawdata_id;
        this.data = data;
        this.context = context;
        this.timestamp = timestamp;
        this.type = null;
        this.location = null;
        this.auth_id = null;
    }
    MonitorRawdata.tableToObject = function (row) {
        return new MonitorRawdata(row.rawdata_id, row.data, row.context, row.timestamp);
    };

    MonitorRawdata.prototype.setMonitorInfo = function (type, location, auth_id) {
        this.type = type;
        this.location = location;
        this.auth_id = auth_id;
    };
    return MonitorRawdata;
})();
exports.MonitorRawdata = MonitorRawdata;

var MonitorRawdataDAO = (function (_super) {
    __extends(MonitorRawdataDAO, _super);
    function MonitorRawdataDAO() {
        _super.apply(this, arguments);
    }
    MonitorRawdataDAO.prototype.insert = function (params, callback) {
        this.con.query('INSERT INTO assurenote_monitor_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)', [params.monitor_id, params.data, params.context ? params.context : '', params.timestamp], function (err, result) {
            if (err) {
                callback(err, params.monitor_id, null);
                return;
            }
            callback(err, params.monitor_id, result.insertId);
        });
    };

    MonitorRawdataDAO.prototype.get = function (rawdata_id, callback) {
        var _this = this;
        async.waterfall([
            function (next) {
                _this.con.query('SELECT * FROM assurenote_monitor_rawdata WHERE rawdata_id=?', [rawdata_id], function (err, result) {
                    result = result[0];
                    next(err, MonitorRawdata.tableToObject(result), result.monitor_id);
                });
            },
            function (rawdata, monitor_id, next) {
                var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(_this.con);
                monitorItemDAO.get(monitor_id, function (err, monitor) {
                    rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
                    next(err, rawdata);
                });
            }
        ], function (err, rawdata) {
            callback(err, rawdata);
        });
    };

    MonitorRawdataDAO.prototype.getWithMonitorInfo = function (rawdata_id, monitor, callback) {
        this.con.query('SELECT * FROM assurenote_monitor_rawdata WHERE rawdata_id=?', [rawdata_id], function (err, result) {
            result = result[0];
            var rawdata = MonitorRawdata.tableToObject(result);
            rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
            callback(err, rawdata);
        });
    };
    return MonitorRawdataDAO;
})(model.DAO);
exports.MonitorRawdataDAO = MonitorRawdataDAO;

