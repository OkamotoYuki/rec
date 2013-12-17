///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
var async = require('async');

export interface InsertArg {
	user: string;
	host: string
	filepath: string;
	funcname: string;
	latest_version: number;
}

export class DShellTestItem {

	constructor(public test_id: number, user: string, host: string, filepath: string, funcname: string, latest_version: number) {
	}

	static tableToObject(row: any) {
		return new DShellTestItem(row.test_id, row.user, row.host, row.filepath, row.funcname, row.latest_version);
	}

}

export class DShellTestItemDAO extends model.DAO {

	insert(params: InsertArg, callback: (err: any, monitor_id: number)=>void): void {
		this.con.query('INSERT INTO dshell_test_items(user, host, filepath, funcname, latest_version) VALUES(?, ?, ?, ?, 0)',
			[params.user, params.host, params.filepath, params.funcname],
			(err, result) => {
				if(err) {
					callback(err, null);
				}
				callback(err, result.insertId);
			}
		);
	}

	update(test_id: number, latest_version: number, callback: (err: any) => void): void {
		this.con.query('UPDATE dshell_test_items SET latest_version=? WHERE test_id=?',
			[latest_version, test_id],
			(err, result) => {
				callback(err);
			}
		);
	}

	get(test_id: number, callback: (err: any, dshellTestItem: DShellTestItem) => void): void {
		this.con.query('SELECT * FROM dshell_test_items WHERE test_id=?',
			[test_id],
			(err, result) => {
				result = result[0];
				callback(err, DShellTestItem.tableToObject(result));
			}
		);
	}

	getByTestItemInfo(user: string, host: string, funcname: string, callback: (err: any, dshellTestItem: DShellTestItem) => void): void {
		this.con.query('SELECT * FROM dshell_test_items WHERE user=? AND host=? AND funcname=?',
			[user, host, funcname],
			(err, result) => {
				if(err) {
					callback(err, null);
					return;
				}
				if(result.length == 0) {   // no such a monitor
					callback(err, null);
					return;
				}
				result = result[0];
				callback(err, DShellTestItem.tableToObject(result));
			}
		);
	}

}
