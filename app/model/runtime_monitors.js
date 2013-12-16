var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var RuntimeMonitor = (function () {
    function RuntimeMonitor(monitor_id, type, location, auth_id, begin_timestamp, latest_timestamp) {
        this.monitor_id = monitor_id;
        this.type = type;
        this.location = location;
        this.auth_id = auth_id;
        this.begin_timestamp = begin_timestamp;
        this.latest_timestamp = latest_timestamp;
    }
    RuntimeMonitor.tableToObject = function (row) {
        return new RuntimeMonitor(row.monitor_id, row.type, row.location, row.auth_id, row.begin_timestamp, row.latest_timestamp);
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
        this.con.query('INSERT INTO runtime_monitors(type, location, auth_id) VALUES(?, ?, ?)', [params.type, params.location, params.auth_id], function (err, result) {
            if (err) {
                callback(err, null);
            }
            callback(err, result.monitor_id);
        });
    };
    return RuntimeMonitorDAO;
})(model.DAO);
exports.RuntimeMonitorDAO = RuntimeMonitorDAO;

