///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
var async = require('async');

export interface InsertArg {
	monitor_id: number;
	data: number;
	context?: string;
	timestamp: Date;
}

export class RuntimeRawdata {

	type: string;
	location: string;
	auth_id: string;

	constructor(public rawdata_id: number, public data: number, public context: string, public timestamp: Date) {
		this.type = null;
		this.location = null;
		this.auth_id = null;
	}

	static tableToObject(row: any) {
		return new RuntimeRawdata(row.rawdata_id, row.data, row.context, row.timestamp);
	}

	setMonitorInfo(type: string, location: string, auth_id: string): void {
		this.type = type;
		this.location = location;
		this.auth_id = auth_id;
	}

}

export class RuntimeRawdataDAO extends model.DAO {

	insert(params: InsertArg, callback: (err: any, monitor_id: number, rawdata_id: number)=>void): void {
		this.con.query('INSERT INTO runtime_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)',
			[params.monitor_id, params.data, params.context ? params.context : '', params.timestamp],
			(err, result) => {
				if(err) {
					callback(err, params.monitor_id, null);
					return;
				}
				callback(err, params.monitor_id, result.insertId);
			}
		);
	}

	get(rawdata_id: number, callback: (err: any, rawdata: RuntimeRawdata)=>void): void {
		async.waterfall([
			(next) => {
				this.con.query('SELECT * FROM runtime_rawdata WHERE rawdata_id=?',
					[rawdata_id],
					(err, result) => {
						result = result[0];
						next(err, RuntimeRawdata.tableToObject(result), result.monitor_id);
					}
				);
			},
			(rawdata: RuntimeRawdata, monitor_id: number, next) => {
				this.con.query('SELECT * FROM runtime_monitors WHERE monitor_id=?',
					[monitor_id],
					(err, result) => {
						rawdata.setMonitorInfo(result.type, result.location, result.auth_id);
						next(err, rawdata);
					}
				);
			}
		],
		(err: any, rawdata: RuntimeRawdata) => {
			callback(err, rawdata);
		});
	}

}
