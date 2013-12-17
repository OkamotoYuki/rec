var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var DShellTestItem = (function () {
    function DShellTestItem(test_id, user, host, filepath, funcname, latest_version) {
        this.test_id = test_id;
    }
    DShellTestItem.tableToObject = function (row) {
        return new DShellTestItem(row.test_id, row.user, row.host, row.filepath, row.funcname, row.latest_version);
    };
    return DShellTestItem;
})();
exports.DShellTestItem = DShellTestItem;

var DShellTestItemDAO = (function (_super) {
    __extends(DShellTestItemDAO, _super);
    function DShellTestItemDAO() {
        _super.apply(this, arguments);
    }
    DShellTestItemDAO.prototype.insert = function (params, callback) {
        this.con.query('INSERT INTO dshell_test_items(user, host, filepath, funcname, latest_version) VALUES(?, ?, ?, ?, 0)', [params.user, params.host, params.filepath, params.funcname], function (err, result) {
            if (err) {
                callback(err, null);
            }
            callback(err, result.insertId);
        });
    };

    DShellTestItemDAO.prototype.update = function (test_id, latest_version, callback) {
        this.con.query('UPDATE dshell_test_items SET latest_version=? WHERE test_id=?', [latest_version, test_id], function (err, result) {
            callback(err);
        });
    };

    DShellTestItemDAO.prototype.get = function (test_id, callback) {
        this.con.query('SELECT * FROM dshell_test_items WHERE test_id=?', [test_id], function (err, result) {
            result = result[0];
            callback(err, DShellTestItem.tableToObject(result));
        });
    };

    DShellTestItemDAO.prototype.getByTestItemInfo = function (user, host, funcname, callback) {
        this.con.query('SELECT * FROM dshell_test_items WHERE user=? AND host=? AND funcname=?', [user, host, funcname], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(err, null);
                return;
            }
            result = result[0];
            callback(err, DShellTestItem.tableToObject(result));
        });
    };
    return DShellTestItemDAO;
})(model.DAO);
exports.DShellTestItemDAO = DShellTestItemDAO;

