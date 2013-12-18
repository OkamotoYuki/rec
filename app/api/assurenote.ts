///<reference path='../d.ts/DefinitelyTyped/async/async.d.ts'/>

import db = module('../db/db');
import type = module('./type')
import error = module('./error');
import model_assurenote_monitor_items = module('../model/assurenote_monitor_items');
import model_assurenote_monitor_rawdata = module('../model/assurenote_monitor_rawdata');
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
	var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);
	var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);
	var timestamp = new Date();

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			monitorItemDAO.selectItem(params.type, params.location, (err: any, monitor: model_assurenote_monitor_items.MonitorItem) => next(err, monitor));
		},
		(monitor: model_assurenote_monitor_items.MonitorItem, next) => {
			if(monitor) {
				next(null, monitor.monitor_id);
			}
			else {
				params['begin_timestamp'] = timestamp;
				params['latest_timestamp'] = timestamp;
				monitorItemDAO.insertItem(params, (err: any, monitor_id: number) => next(err, monitor_id));
			}
		},
		(monitor_id: number, next) => {
			monitorRawdataDAO.insertRawdata({ monitor_id: monitor_id, data: params.data, context: params.context, timestamp: timestamp }, (err: any, monitor_id: number, rawdata_id: number) => next(err, monitor_id, rawdata_id));
		},
		(monitor_id: number, rawdata_id: number, next) => {
			monitorItemDAO.updateItem(monitor_id, rawdata_id, timestamp, (err: any) => next(err, rawdata_id));
		},
		(rawdata_id: number, next) => {
			con.commit((err, result) => next(err, rawdata_id));
		}
	], (err: any, rawdata_id: number) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
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

	var con = new db.Database();
	var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			monitorRawdataDAO.getRawdata(params.rawdata_id, (err: any, rawdata: model_assurenote_monitor_rawdata.MonitorRawdata) => next(err, rawdata));
		},
		(rawdata: model_assurenote_monitor_rawdata.MonitorRawdata, next) => {
			con.commit((err, result) => next(err, rawdata));
		}
	],
	(err: any, rawdata: model_assurenote_monitor_rawdata.MonitorRawdata, next) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess(rawdata);
	});

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

	var con = new db.Database();
	var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);
	var monitorRawdataDAO = new model_assurenote_monitor_rawdata.MonitorRawdataDAO(con);
	var timestamp = new Date();

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			monitorItemDAO.selectItem(params.type, params.location, (err: any, monitor: model_assurenote_monitor_items.MonitorItem) => next(err, monitor));
		},
		(monitor: model_assurenote_monitor_items.MonitorItem, next) => {
			monitorRawdataDAO.getRawdataWithMonitorInfo(monitor.latest_data_id, monitor, (err: any, rawdata: model_assurenote_monitor_rawdata.MonitorRawdata) => next(err, rawdata));
		},
		(rawdata: model_assurenote_monitor_rawdata.MonitorRawdata, next) => {
			con.commit((err, result) => next(err, rawdata));
		}
	],
	(err: any, rawdata: model_assurenote_monitor_rawdata.MonitorRawdata, next) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess(rawdata);
	});
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
	var con = new db.Database();
	var monitorItemDAO = new model_assurenote_monitor_items.MonitorItemDAO(con);

	async.waterfall([
		(next) => {
			con.begin((err, result) => next(err));
		},
		(next) => {
			monitorItemDAO.getItemList((err: any, monitorList: model_assurenote_monitor_items.MonitorItem[]) => next(err, monitorList));
		},
		(monitorList: model_assurenote_monitor_items.MonitorItem[], next) => {
			con.commit((err, result) => next(err, monitorList));
		}
	],
	(err: any, monitorList: model_assurenote_monitor_items.MonitorItem[], next) => {
		if(err) {
			con.rollback();
			con.close();
			callback.onFailure(err);
			return;
		}
		con.close();
		callback.onSuccess(monitorList);
	});

}
