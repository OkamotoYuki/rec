///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
import model_dshell_test_envs = module('./dshell_test_envs');
var async = require('async');

export interface InsertArg {
	env_id: number;
	funcname: string;
	result: boolean;
	ignorable: boolean;
	timestamp: Date;
}

export class TestResult {

	user: string;
	host: string;
	version: string;

	constructor(public result_id: number, public funcname: string, public result: boolean, public ignorable: boolean, public timestamp: Date) {
		this.user = null;
		this.host = null;
		this.version = null;
	}

	static tableToObject(row: any) {
		return new TestResult(row.result_id, row.funcname, Boolean(row.result), Boolean(row.ignorable), row.timestamp);
	}

	setEnvInfo(user: string, host: string, version: string): void {
		this.user = user;
		this.host = host;
		this.version = version;
	}

}

export class TestResultDAO extends model.DAO {

	insertResult(params: InsertArg, callback: (err: any, result_id: number) => void): void {
		this.con.query('INSERT INTO dshell_test_results(env_id, funcname, result, ignorable, timestamp) VALUES(?, ?, ?, ?, ?)',
			[params.env_id, params.funcname, params.result, params.ignorable, params.timestamp],
			(err, result) => {
				if(err) {
					callback(err, null);
					return;
				}
				callback(err, result.insertId);
			}
		);
	}

	selectResult(user: string, host: string, version: string, funcname: string, callback: (err: any, testResult: TestResult) => void): void {
		var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(this.con);

		async.waterfall([
			(next) => {
				testEnvDAO.selectEnv(user, host, version, (err: any, env: model_dshell_test_envs.TestEnv) => next(err, env));
			},
			(env: model_dshell_test_envs.TestEnv, next) => {
				this.con.query('SELECT * FROM dshell_test_results WHERE env_id=? AND funcname=?',
					[env.env_id, funcname],
					(err, result) => {
						result = result[0];
						var testResult = TestResult.tableToObject(result);
						testResult.setEnvInfo(env.user, env.host, env.version);
						next(err, testResult);
					}
				);
			}
		],
		(err: any, testResult: TestResult) => {
			callback(err, testResult);
		});
	}

	selectResultList(user: string, host: string, version: string, callback: (err: any, testResultList: TestResult[]) => void): void {
		var testEnvDAO = new model_dshell_test_envs.TestEnvDAO(this.con);

		async.waterfall([
			(next) => {
				testEnvDAO.selectEnv(user, host, version, (err: any, env: model_dshell_test_envs.TestEnv) => next(err, env));
			},
			(env: model_dshell_test_envs.TestEnv, next) => {
				this.con.query('SELECT * FROM dshell_test_results WHERE env_id=?',
					[env.env_id],
					(err, result) => {
						var testResultList: TestResult[] = [];
						for(var i: number = 0; i < result.length; i++) {
							var testResult: TestResult = TestResult.tableToObject(result[i]);
							testResult.setEnvInfo(env.user, env.host, env.version);
							testResultList.push(testResult);
						}
						next(err, testResultList);
					}
				);
			}
		],
		(err: any, testResultList: TestResult[]) => {
			callback(err, testResultList);
		});
	}

}
