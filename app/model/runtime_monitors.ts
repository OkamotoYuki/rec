///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
var async = require('async');

export interface InsertArg {
	type: string;
	location: string;
	auth_id: string;
}

export class RuntimeMonitor {

	constructor(public monitor_id: number, public type: string, public location: string, public auth_id: string, public begin_timestamp: string, public latest_timestamp: string) {
	}

	static tableToObject(row: any) {
		return new RuntimeMonitor(row.monitor_id, row.type, row.location, row.auth_id, row.begin_timestamp, row.latest_timestamp);
	}

}

export class RuntimeMonitorDAO extends model.DAO {

	insert(params: InsertArg, callback: (err: any, monitor_id: number)=>void): void {
		this.con.query('INSERT INTO runtime_monitors(type, location, auth_id) VALUES(?, ?, ?)',
				[params.type, params.location, params.auth_id],
				(err, result) => {
					if(err) {
						callback(err, null);
					}
					callback(err, result.monitor_id);
				});
	}

}
