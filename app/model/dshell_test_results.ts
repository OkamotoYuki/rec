///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import model = module('./model');
import model_dshell_test_items = module('./dshell_test_items');
var async = require('async');

export interface InsertArg {
	test_id: number;
	version: number;
	result: boolean;
	failure_acceptable: boolean;
	timestamp: Date;
}

export class DShellTestResult {

	user: string;
	host: string;
	filepath: string;
	funcname: string;

	constructor(public result_id: number, public version: number, public result: boolean, public failure_acceptable: boolean, public timestamp: Date) {
		this.user = null;
		this.host = null;
		this.filepath = null;
		this.funcname = null;
	}

	static tableToObject(row: any) {
		return new DShellTestResult(row.result_id, row.version, row.result, row.failure_acceptable, row.timestamp);
	}

	setTestItemInfo(): void {
	}

}

//export class RuntimeRawdataDAO extends model.DAO {
//
//	insert(params: InsertArg, callback: (err: any, monitor_id: number, rawdata_id: number)=>void): void {
//		this.con.query('INSERT INTO runtime_rawdata(monitor_id, data, context, timestamp) VALUES(?, ?, ?, ?)',
//			[params.monitor_id, params.data, params.context ? params.context : '', params.timestamp],
//			(err, result) => {
//				if(err) {
//					callback(err, params.monitor_id, null);
//					return;
//				}
//				callback(err, params.monitor_id, result.insertId);
//			}
//		);
//	}
//
//	get(rawdata_id: number, callback: (err: any, rawdata: RuntimeRawdata)=>void): void {
//		async.waterfall([
//			(next) => {
//				this.con.query('SELECT * FROM runtime_rawdata WHERE rawdata_id=?',
//					[rawdata_id],
//					(err, result) => {
//						result = result[0];
//						next(err, RuntimeRawdata.tableToObject(result), result.monitor_id);
//					}
//				);
//			},
//			(rawdata: RuntimeRawdata, monitor_id: number, next) => {
//				var runtimeMonitorDAO = new model_runtime_monitors.RuntimeMonitorDAO(this.con);
//				runtimeMonitorDAO.get(monitor_id, (err: any, monitor: model_runtime_monitors.RuntimeMonitor) => {
//					rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
//					next(err, rawdata);
//				});
//			}
//		],
//		(err: any, rawdata: RuntimeRawdata) => {
//			callback(err, rawdata);
//		});
//	}
//
//	getWithMonitorInfo(rawdata_id: number, monitor: model_runtime_monitors.RuntimeMonitor, callback: (err: any, rawdata: RuntimeRawdata)=>void): void {
//		this.con.query('SELECT * FROM runtime_rawdata WHERE rawdata_id=?',
//			[rawdata_id],
//			(err, result) => {
//				result = result[0];
//				var rawdata = RuntimeRawdata.tableToObject(result);
//				rawdata.setMonitorInfo(monitor.type, monitor.location, monitor.auth_id);
//				callback(err, rawdata);
//			}
//		);
//	}
//
//}
