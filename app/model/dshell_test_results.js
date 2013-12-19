var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model = require('./model');
var model_dshell_test_envs = require('./dshell_test_envs');
var async = require('async');

var TestResult = (function () {
    function TestResult(result_id, funcname, result, ignorable, timestamp) {
        this.result_id = result_id;
        this.funcname = funcname;
        this.result = result;
        this.ignorable = ignorable;
        this.timestamp = timestamp;
        this.user = null;
        this.host = null;
        this.version = null;
    }
    TestResult.tableToObject = function (row) {
        return new TestResult(row.result_id, row.funcname, Boolean(row.result), Boolean(row.ignorable), row.timestamp);
    };

    TestResult.prototype.setEnvInfo = function (user, host, version) {
        this.user = user;
        this.host = host;
        this.version = version;
    };
    return TestResult;
})();
exports.TestResult = TestResult;

var TestResultDAO = (function (_super) {
    __extends(TestResultDAO, _super);
    function TestResultDAO() {
        _super.apply(this, arguments);
    }
    TestResultDAO.prototype.insertResult = function (params, callback) {
        this.con.query('INSERT INTO dshell_test_results(env_id, funcname, result, ignorable, timestamp) VALUES(?, ?, ?, ?, ?)', [params.env_id, params.funcname, params.result, params.ignorable, params.timestamp], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(err, result.insertId);
        });
    };

    TestResultDAO.prototype.selectResult = function (user, host, version, funcname, callback) {
        var _this = this;
        var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(this.con);

        async.waterfall([
            function (next) {
                testEnvDAO.selectEnv(user, host, version, function (err, env) {
                    return next(err, env);
                });
            },
            function (env, next) {
                _this.con.query('SELECT * FROM dshell_test_results WHERE env_id=? AND funcname=?', [env.env_id, funcname], function (err, result) {
                    result = result[0];
                    var testResult = TestResult.tableToObject(result);
                    testResult.setEnvInfo(env.user, env.host, env.version);
                    next(err, testResult);
                });
            }
        ], function (err, testResult) {
            callback(err, testResult);
        });
    };

    TestResultDAO.prototype.selectResultList = function (user, host, version, callback) {
        var _this = this;
        var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(this.con);

        async.waterfall([
            function (next) {
                testEnvDAO.selectEnv(user, host, version, function (err, env) {
                    return next(err, env);
                });
            },
            function (env, next) {
                _this.con.query('SELECT * FROM dshell_test_results WHERE env_id=?', [env.env_id], function (err, result) {
                    var testResultList = [];
                    for (var i = 0; i < result.length; i++) {
                        var testResult = TestResult.tableToObject(result[i]);
                        testResult.setEnvInfo(env.user, env.host, env.version);
                        testResultList.push(testResult);
                    }
                    next(err, testResultList);
                });
            }
        ], function (err, testResultList) {
            callback(err, testResultList);
        });
    };
    return TestResultDAO;
})(model.DAO);
exports.TestResultDAO = TestResultDAO;

