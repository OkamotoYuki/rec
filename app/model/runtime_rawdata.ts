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

	constructor(public rawdata_id: number, public type: string, public location: string, public auth_id: string, data: number, context: string, public timestamp: Date) {
	}

	static tableToObject(row: any) {
		return new RuntimeRawdata(row.rawdata_id, row.type, row.location, row.auth_id, row.data, row.context, row.timestamp);
	}

}

export class RuntimeRawdataDAO extends model.DAO {

	insert(params: InsertArg, callback: (err: any, monitor_id: number, rawdata_id: number)=>void): void {
		this.con.query('INSERT INTO runtime_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)',
			[params.monitor_id, params.data, params.context ? params.context : '', params.timestamp],
			(err, result) => {
				if(err) {
					callback(err, params.monitor_id, null);
				}
				callback(err, params.monitor_id, result.insertId);
			}
		);
	}

}
