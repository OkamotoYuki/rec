///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import db = module('../db/db');
import type = module('./type')
import error = module('./error');
import model_runtime_monitors = module('../model/runtime_monitors');
import model_runtime_rawdata = module('../model/runtime_rawdata');
var async = require('async');

export function pushRawData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(params && !params.data) checks.push('Monitor data is required.');
		if(params && !params.auth_id) checks.push('Auth ID is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	var con = new db.Database();
	var runtimeMonitorDAO = new model_runtime_monitors.RuntimeMonitorDAO(con);
	var runtimeRawdataDAO = new model_runtime_rawdata.RuntimeRawdataDAO(con);
	var timestamp = new Date();

	async.waterfall([
		(next) => {
			runtimeMonitorDAO.get(params.type, params.location, params.auth_id, (err: any, monitor: model_runtime_monitors.RuntimeMonitor) => next(err, monitor));
		},
		(monitor: model_runtime_monitors.RuntimeMonitor, next) => {
			if(monitor) {
				next(null, monitor.monitor_id);
			}
			else {
				params['begin_timestamp'] = timestamp;
				params['latest_timestamp'] = timestamp;
				runtimeMonitorDAO.insert(params, (err: any, monitor_id: number) => next(err, monitor_id));
			}
		},
		(monitor_id: number, next) => {
			runtimeRawdataDAO.insert({ monitor_id: monitor_id, data: params.data, context: params.context, timestamp: timestamp }, (err: any, monitor_id: number, rawdata_id: number) => next(err, monitor_id, rawdata_id));
		},
		(monitor_id: number, rawdata_id: number, next) => {
			runtimeMonitorDAO.update(monitor_id, rawdata_id, timestamp, (err: any) => next(err, rawdata_id));
		}
	], (err: any, rawdata_id: number) => {
		con.close();
		if(err) {
			callback.onFailure(err);
			return;
		}
		callback.onSuccess({ rawdata_id: rawdata_id });
	});
}

export function getRawData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.rawdata_id) checks.push('Rawdata ID is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });    // FIXME
}

export function getLatestData(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess({ rawdata_id: 0, type: 'CpuUsage', location: 'AppServer', data: 1, auth_id: 'admin@gmail.com', timestamp: new Date().toString(), context: "dummy" });    // FIXME
}

export function getRawDataList(params: any, callback: type.Callback) {
	function validate(params: any): boolean {
		var checks = [];
		if(!params) checks.push('Parameter is required.');
		if(params && !params.type) checks.push('Monitor type is required.');
		if(params && !params.location) checks.push('Monitor location is required.');
		if(checks.length > 0) {
			callback.onFailure(new error.InvalidParamsError(checks, null));
		}
		return true;
	}
	if(!validate(params)) return;

	// TODO
	callback.onSuccess([]);    // FIXME
}

export function getMonitorList(params: any, callback: type.Callback) {
	// TODO
	callback.onSuccess([]);    // FIXME
}
