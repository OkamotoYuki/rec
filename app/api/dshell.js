var db = require('../db/db');

var error = require('./error');
var model_dshell_test_envs = require('../model/dshell_test_envs');
var model_dshell_test_results = require('../model/dshell_test_results');
var async = require('async');

function pushTestResult(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (params && !('result' in params))
            checks.push('Test result is required.');

        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    var con = new db.Database();
    var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(con);
    var testResultDAO = new model_dshell_test_results.TestResultDAO(con);
    var timestamp = new Date();

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            testEnvDAO.selectEnv(params.user, params.host, params.version, function (err, env) {
                return next(err, env);
            });
        },
        function (env, next) {
            if (env) {
                next(null, env.env_id);
            } else {
                testEnvDAO.insertEnv(params, function (err, env_id) {
                    return next(err, env_id);
                });
            }
        },
        function (env_id, next) {
            testResultDAO.insertResult({ env_id: env_id, funcname: params.funcname, result: params.result, ignorable: false, timestamp: timestamp }, function (err, result_id) {
                return next(err, result_id);
            });
        },
        function (result_id, next) {
            con.commit(function (err, result) {
                return next(err, result_id);
            });
        }
    ], function (err, result_id) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess({ result_id: result_id });
    });
}
exports.pushTestResult = pushTestResult;

function getTestResult(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (params && !params.funcname)
            checks.push('Function name is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    var con = new db.Database();
    var testResultDAO = new model_dshell_test_results.TestResultDAO(con);

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            testResultDAO.selectResult(params.user, params.host, params.version, params.funcname, function (err, testResult) {
                return next(err, testResult);
            });
        },
        function (testResult, next) {
            con.commit(function (err, result) {
                return next(err, testResult);
            });
        }
    ], function (err, testResult) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess(testResult);
    });
}
exports.getTestResult = getTestResult;

function getTestResultList(params, callback) {
    function validate(params) {
        var checks = [];
        if (!params)
            checks.push('Parameter is required.');
        if (params && !params.user)
            checks.push('User name is required.');
        if (params && !params.host)
            checks.push('Host name is required.');
        if (params && !params.version)
            checks.push('Test version is required.');
        if (checks.length > 0) {
            callback.onFailure(new error.InvalidParamsError(checks, null));
        }
        return true;
    }
    if (!validate(params))
        return;

    var con = new db.Database();
    var testResultDAO = new model_dshell_test_results.TestResultDAO(con);

    async.waterfall([
        function (next) {
            con.begin(function (err, result) {
                return next(err);
            });
        },
        function (next) {
            testResultDAO.selectResultList(params.user, params.host, params.version, function (err, testResultList) {
                return next(err, testResultList);
            });
        },
        function (testResultList, next) {
            con.commit(function (err, result) {
                return next(err, testResultList);
            });
        }
    ], function (err, testResultList) {
        if (err) {
            con.rollback();
            con.close();
            callback.onFailure(err);
            return;
        }
        con.close();
        callback.onSuccess(testResultList);
    });
}
exports.getTestResultList = getTestResultList;

