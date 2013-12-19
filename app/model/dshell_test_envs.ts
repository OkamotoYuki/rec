///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
var async = require('async');

export interface InsertArg {
	user: string;
	host: string;
	version: string;
}

export class TestEnv {

	constructor(public env_id: number, public user: string, public host: string, public version: string) {
	}

	static tableToObject(row: any) {
		return new TestEnv(row.env_id, row.user, row.host, row.version);
	}

}

export class TestEnvDAO extends model.DAO {

	insertEnv(params: InsertArg, callback: (err: any, env_id: number)=>void): void {
		this.con.query('INSERT INTO dshell_test_envs(user, host, version) VALUES(?, ?, ?)',
			[params.user, params.host, params.version],
			(err, result) => {
				if(err) {
					callback(err, null);
				}
				callback(err, result.insertId);
			}
		);
	}

	getEnv(env_id: number, callback: (err: any, env: TestEnv) => void): void {
		this.con.query('SELECT * FROM dshell_test_envs WHERE env_id=?',
			[env_id],
			(err, result) => {
				result = result[0];
				callback(err, TestEnv.tableToObject(result));
			}
		);
	}

	selectEnv(user: string, host: string, version: string, callback: (err: any, env: TestEnv) => void): void {
		this.con.query('SELECT * FROM dshell_test_envs WHERE user=? AND host=? AND version=?',
			[user, host, version],
			(err, result) => {
				if(err) {
					callback(err, null);
					return;
				}
				if(result.length == 0) {   // no such env
					callback(err, null);
					return;
				}
				result = result[0];
				callback(err, TestEnv.tableToObject(result));
			}
		);
	}

}
