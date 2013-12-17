///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
var async = require('async');

export interface InsertArg {
	type: string;
	location: string;
	auth_id: string;
	begin_timestamp: Date;
	latest_timestamp: Date;
}

export class RuntimeMonitor {

	constructor(public monitor_id: number, public type: string, public location: string, public auth_id: string, public latest_data_id: number, public begin_timestamp: Date, public latest_timestamp: Date) {
	}

	static tableToObject(row: any) {
		return new RuntimeMonitor(row.monitor_id, row.type, row.location, row.auth_id, row.latest_data_id, row.begin_timestamp, row.latest_timestamp);
	}

}

export class RuntimeMonitorDAO extends model.DAO {

	insert(params: InsertArg, callback: (err: any, monitor_id: number)=>void): void {
		this.con.query('INSERT INTO runtime_monitors(type, location, auth_id, begin_timestamp, latest_timestamp) VALUES(?, ?, ?, ?, ?)',
			[params.type, params.location, params.auth_id, params.begin_timestamp, params.latest_timestamp],
			(err, result) => {
				if(err) {
					callback(err, null);
				}
				callback(err, result.insertId);
			}
		);
	}

	update(monitor_id: number, latest_data_id: number, latest_timestamp: Date, callback: (err: any) => void): void {
		this.con.query('UPDATE runtime_monitors SET latest_data_id=?, latest_timestamp=? WHERE monitor_id=?',
			[latest_data_id, latest_timestamp, monitor_id],
			(err, result) => {
				callback(err);
			}
		);
	}

	get(monitor_id: number, callback: (err: any, monitor: RuntimeMonitor) => void): void {
		this.con.query('SELECT * FROM runtime_monitors WHERE monitor_id=?',
			[monitor_id],
			(err, result) => {
				result = result[0];
				callback(err, RuntimeMonitor.tableToObject(result));
			}
		);
	}

	getByMonitorInfo(type: string, location: string, callback: (err: any, monitor: RuntimeMonitor) => void): void {
		this.con.query('SELECT * FROM runtime_monitors WHERE type=? AND location=?',
			[type, location],
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
				callback(err, RuntimeMonitor.tableToObject(result));
			}
		);
	}

}
