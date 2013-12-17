var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var RuntimeRawdata = (function () {
    function RuntimeRawdata(rawdata_id, type, location, auth_id, data, context, timestamp) {
        this.rawdata_id = rawdata_id;
        this.type = type;
        this.location = location;
        this.auth_id = auth_id;
        this.timestamp = timestamp;
    }
    RuntimeRawdata.tableToObject = function (row) {
        return new RuntimeRawdata(row.rawdata_id, row.type, row.location, row.auth_id, row.data, row.context, row.timestamp);
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
            }
            callback(err, params.monitor_id, result.insertId);
        });
    };
    return RuntimeRawdataDAO;
})(model.DAO);
exports.RuntimeRawdataDAO = RuntimeRawdataDAO;

