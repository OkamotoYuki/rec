var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var async = require('async');

var TestEnv = (function () {
    function TestEnv(env_id, user, host, version) {
        this.env_id = env_id;
        this.user = user;
        this.host = host;
        this.version = version;
    }
    TestEnv.tableToObject = function (row) {
        return new TestEnv(row.env_id, row.user, row.host, row.version);
    };
    return TestEnv;
})();
exports.TestEnv = TestEnv;

var TestEnvDAO = (function (_super) {
    __extends(TestEnvDAO, _super);
    function TestEnvDAO() {
        _super.apply(this, arguments);
    }
    TestEnvDAO.prototype.insertEnv = function (params, callback) {
        this.con.query('INSERT INTO dshell_test_envs(user, host, version) VALUES(?, ?, ?)', [params.user, params.host, params.version], function (err, result) {
            if (err) {
                callback(err, null);
            }
            callback(err, result.insertId);
        });
    };

    TestEnvDAO.prototype.getEnv = function (env_id, callback) {
        this.con.query('SELECT * FROM dshell_test_envs WHERE env_id=?', [env_id], function (err, result) {
            result = result[0];
            callback(err, TestEnv.tableToObject(result));
        });
    };

    TestEnvDAO.prototype.selectEnv = function (user, host, version, callback) {
        this.con.query('SELECT * FROM dshell_test_envs WHERE user=? AND host=? AND version=?', [user, host, version], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(err, null);
                return;
            }
            result = result[0];
            callback(err, TestEnv.tableToObject(result));
        });
    };
    return TestEnvDAO;
})(model.DAO);
exports.TestEnvDAO = TestEnvDAO;

