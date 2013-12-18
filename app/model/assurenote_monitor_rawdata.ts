///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
import model_assurenote_monitor_items = module('./assurenote_monitor_items');
var async = require('async');

export interface InsertArg {
	monitor_id: number;
	data: number;
	context?: string;
	timestamp: Date;
}

export class MonitorRawdata {

	type: string;
	location: string;
	auth_id: string;

	constructor(public rawdata_id: number, public data: number, public context: string, public timestamp: Date) {
		this.type = null;
		this.location = null;
		this.auth_id = null;
	}

	static tableToObject(row: any) {
		return new MonitorRawdata(row.rawdata_id, row.data, row.context, row.timestamp);
	}

	setMonitorInfo(type: string, location: string, auth_id: string): void {
		this.type = type;
		this.location = location;
		this.auth_id = auth_id;
	}

}

export class MonitorRawdataDAO extends model.DAO {

	insertRawdata(params: InsertArg, callback: (err: any, monitor_id: number, rawdata_id: number)=>void): void {
		this.con.query('INSERT INTO assurenote_monitor_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)',
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

	_fillRawdataWithMonitorInfo(rawdata: MonitorRawdata, monitor_id: number, callback: (err: any, rawdata: MonitorRawdata) => void): void {
		var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(this.con);
		monitorItemDAO.getItem(monitor_id, (err: any, monitor: model_assurenote_monitor_items.MonitorItem) => {
			rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
			callback(err, rawdata);
		});
	}

	getRawdata(rawdata_id: number, callback: (err: any, rawdata: MonitorRawdata)=>void): void {
		var self = this;
		async.waterfall([
			(next) => {
				this.con.query('SELECT * FROM assurenote_monitor_rawdata WHERE rawdata_id=?',
					[rawdata_id],
					(err, result) => {
						result = result[0];
						next(err, MonitorRawdata.tableToObject(result), result.monitor_id);
					}
				);
			},
			(rawdata: MonitorRawdata, monitor_id: number, next) => {
				self._fillRawdataWithMonitorInfo(rawdata, monitor_id, next);
			}
		],
		(err: any, rawdata: MonitorRawdata) => {
			callback(err, rawdata);
		});
	}

	getRawdataWithMonitorInfo(rawdata_id: number, monitor: model_assurenote_monitor_items.MonitorItem, callback: (err: any, rawdata: MonitorRawdata)=>void): void {
		this.con.query('SELECT * FROM assurenote_monitor_rawdata WHERE rawdata_id=?',
			[rawdata_id],
			(err, result) => {
				result = result[0];
				var rawdata = MonitorRawdata.tableToObject(result);
				rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
				callback(err, rawdata);
			}
		);
	}

}
