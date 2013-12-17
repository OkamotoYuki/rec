var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var RuntimeMonitor = (function () {
    function RuntimeMonitor(monitor_id, type, location, auth_id, latest_data_id, begin_timestamp, latest_timestamp) {
        this.monitor_id = monitor_id;
        this.type = type;
        this.location = location;
        this.auth_id = auth_id;
        this.latest_data_id = latest_data_id;
        this.begin_timestamp = begin_timestamp;
        this.latest_timestamp = latest_timestamp;
    }
    RuntimeMonitor.tableToObject = function (row) {
        return new RuntimeMonitor(row.monitor_id, row.type, row.location, row.auth_id, row.latest_data_id, row.begin_timestamp, row.latest_timestamp);
    };
    return RuntimeMonitor;
})();
exports.RuntimeMonitor = RuntimeMonitor;

var RuntimeMonitorDAO = (function (_super) {
    __extends(RuntimeMonitorDAO, _super);
    function RuntimeMonitorDAO() {
        _super.apply(this, arguments);
    }
    RuntimeMonitorDAO.prototype.insert = function (params, callback) {
        this.con.query('INSERT INTO runtime_monitors(type, location, auth_id, begin_timestamp, latest_timestamp) VALUES(?, ?, ?, ?, ?)', [params.type, params.location, params.auth_id, params.begin_timestamp, params.latest_timestamp], function (err, result) {
            if (err) {
                callback(err, null);
            }
            callback(err, result.insertId);
        });
    };

    RuntimeMonitorDAO.prototype.update = function (monitor_id, latest_data_id, latest_timestamp, callback) {
        this.con.query('UPDATE runtime_monitors SET latest_data_id=?, latest_timestamp=? WHERE monitor_id=?', [latest_data_id, latest_timestamp, monitor_id], function (err, result) {
            callback(err);
        });
    };

    RuntimeMonitorDAO.prototype.get = function (monitor_id, callback) {
        this.con.query('SELECT * FROM runtime_monitors WHERE monitor_id=?', [monitor_id], function (err, result) {
            result = result[0];
            callback(err, RuntimeMonitor.tableToObject(result));
        });
    };

    RuntimeMonitorDAO.prototype.getByMonitorInfo = function (type, location, callback) {
        this.con.query('SELECT * FROM runtime_monitors WHERE type=? AND location=?', [type, location], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(err, null);
                return;
            }
            result = result[0];
            callback(err, RuntimeMonitor.tableToObject(result));
        });
    };
    return RuntimeMonitorDAO;
})(model.DAO);
exports.RuntimeMonitorDAO = RuntimeMonitorDAO;

