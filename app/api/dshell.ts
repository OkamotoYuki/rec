///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import db = module('../db/db');
import type = module('./type')
import error = module('./error');
import model_dshell_test_envs = module('../model/dshell_test_envs');
import model_dshell_test_results = module('../model/dshell_test_results');
var async = require('async');

export function pushTestResult(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(params && !params.result) checks.push('Test result is required.');
		//if(params && !params.ignorable) checks.push('Condition whether this test is ignorable or not is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	var con = new db.Database();
	var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(con);
	var testResultDAO = new model_dshell_test_results.TestResultDAO(con);
	var timestamp = new Date();

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			testEnvDAO.selectEnv(params.user, params.host, params.version, (err: any, env: model_dshell_test_envs.TestEnv) => next(err, env));
		},
		(env: model_dshell_test_envs.TestEnv, next) => {
			if(env) {
				next(null, env.env_id);
			}
			else {
				testEnvDAO.insertEnv(params, (err: any, env_id: number) => next(err, env_id));
			}
		},
		(env_id: number, next) => {
			testResultDAO.insertResult({ env_id: env_id, funcname: params.funcname, result: params.result, ignorable: false, timestamp: timestamp }, (err: any, result_id: number) => next(err, result_id));
		},
		(result_id: number, next) => {
			con.commit((err, result) => next(err, result_id));
		}
	], (err: any, result_id: number) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess({ result_id: result_id });
	});
}

export function getTestResult(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(params && !params.funcname) checks.push('Function name is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	var con = new db.Database();
	var testResultDAO = new model_dshell_test_results.TestResultDAO(con);

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			testResultDAO.selectResult(params.user, params.host, params.version, params.funcname, (err: any, testResult: model_dshell_test_results.TestResult) => next(err, testResult));
		},
		(testResult: model_dshell_test_results.TestResult, next) => {
			con.commit((err, result) => next(err, testResult));
		}
	],
	(err: any, testResult: model_dshell_test_results.TestResult) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess(testResult);
	});

}

export function getTestResultList(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.user) checks.push('User name is required.');
		if(params && !params.host) checks.push('Host name is required.');
		if(params && !params.version) checks.push('Test version is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	var con = new db.Database();
	var testResultDAO = new model_dshell_test_results.TestResultDAO(con);

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			testResultDAO.selectResultList(params.user, params.host, params.version, (err: any, testResultList: model_dshell_test_results.TestResult[]) => next(err, testResultList));
		},
		(testResultList: model_dshell_test_results.TestResult[], next) => {
			con.commit((err, result) => next(err, testResultList));
		}
	],
	(err: any, testResultList: model_dshell_test_results.TestResult[]) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess(testResultList);
	});
}
