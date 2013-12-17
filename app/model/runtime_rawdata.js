var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var RuntimeRawdata = (function () {
    function RuntimeRawdata(rawdata_id, data, context, timestamp) {
        this.rawdata_id = rawdata_id;
        this.data = data;
        this.context = context;
        this.timestamp = timestamp;
        this.type = null;
        this.location = null;
        this.auth_id = null;
    }
    RuntimeRawdata.tableToObject = function (row) {
        return new RuntimeRawdata(row.rawdata_id, row.data, row.context, row.timestamp);
    };

    RuntimeRawdata.prototype.setMonitorInfo = function (type, location, auth_id) {
        this.type = type;
        this.location = location;
        this.auth_id = auth_id;
    };
    return RuntimeRawdata;
})();
exports.RuntimeRawdata = RuntimeRawdata;

var RuntimeRawdataDAO = (function (_super) {
    __extends(RuntimeRawdataDAO, _super);
    function RuntimeRawdataDAO() {
        _super.apply(this, arguments);
    }
    RuntimeRawdataDAO.prototype.insert = function (params, callback) {
        this.con.query('INSERT INTO runtime_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)', [params.monitor_id, params.data, params.context ? params.context : '', params.timestamp], function (err, result) {
            if (err) {
                callback(err, params.monitor_id, null);
                return;
            }
            callback(err, params.monitor_id, result.insertId);
        });
    };

    RuntimeRawdataDAO.prototype.get = function (rawdata_id, callback) {
        var _this = this;
        async.waterfall([
            function (next) {
                _this.con.query('SELECT * FROM runtime_rawdata WHERE rawdata_id=?', [rawdata_id], function (err, result) {
                    result = result[0];
                    next(err, RuntimeRawdata.tableToObject(result), result.monitor_id);
                });
            },
            function (rawdata, monitor_id, next) {
                _this.con.query('SELECT * FROM runtime_monitors WHERE monitor_id=?', [monitor_id], function (err, result) {
                    rawdata.setMonitorInfo(result.type, result.location, result.auth_id);
                    next(err, rawdata);
                });
            }
        ], function (err, rawdata) {
            callback(err, rawdata);
        });
    };
    return RuntimeRawdataDAO;
})(model.DAO);
exports.RuntimeRawdataDAO = RuntimeRawdataDAO;

