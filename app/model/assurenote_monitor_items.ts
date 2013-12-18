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

export class MonitorItem {

	constructor(public monitor_id: number, public type: string, public location: string, public auth_id: string, public latest_data_id: number, public begin_timestamp: Date, public latest_timestamp: Date) {
	}

	static tableToObject(row: any) {
		return new MonitorItem(row.monitor_id, row.type, row.location, row.auth_id, row.latest_data_id, row.begin_timestamp, row.latest_timestamp);
	}

}

export class MonitorItemDAO extends model.DAO {

	insertItem(params: InsertArg, callback: (err: any, monitor_id: number)=>void): void {
		this.con.query('INSERT INTO assurenote_monitor_items(type, location, auth_id, begin_timestamp, latest_timestamp) VALUES(?, ?, ?, ?, ?)',
			[params.type, params.location, params.auth_id, params.begin_timestamp, params.latest_timestamp],
			(err, result) => {
				if(err) {
					callback(err, null);
				}
				callback(err, result.insertId);
			}
		);
	}

	updateItem(monitor_id: number, latest_data_id: number, latest_timestamp: Date, callback: (err: any) => void): void {
		this.con.query('UPDATE assurenote_monitor_items SET latest_data_id=?, latest_timestamp=? WHERE monitor_id=?',
			[latest_data_id, latest_timestamp, monitor_id],
			(err, result) => {
				callback(err);
			}
		);
	}

	getItem(monitor_id: number, callback: (err: any, monitor: MonitorItem) => void): void {
		this.con.query('SELECT * FROM assurenote_monitor_items WHERE monitor_id=?',
			[monitor_id],
			(err, result) => {
				result = result[0];
				callback(err, MonitorItem.tableToObject(result));
			}
		);
	}

	selectItem(type: string, location: string, callback: (err: any, monitor: MonitorItem) => void): void {
		this.con.query('SELECT * FROM assurenote_monitor_items WHERE type=? AND location=?',
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
				callback(err, MonitorItem.tableToObject(result));
			}
		);
	}

	getItemList(callback: (err: any, monitorList: MonitorItem[]) => void): void {
		this.con.query('SELECT * FROM assurenote_monitor_items',
			(err, result) => {
				if(err) {
					callback(err, null);
				}

				var monitorList: MonitorItem[] = [];
				for(var i: number = 0; i < result.length; i++) {
					monitorList.push(MonitorItem.tableToObject(result[i]));
				}

				callback(err, monitorList);
			}
		);
	}

}
