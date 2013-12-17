

var async = require('async');

var DShellTestResult = (function () {
    function DShellTestResult(result_id, version, result, failure_acceptable, timestamp) {
        this.result_id = result_id;
        this.version = version;
        this.result = result;
        this.failure_acceptable = failure_acceptable;
        this.timestamp = timestamp;
        this.user = null;
        this.host = null;
        this.filepath = null;
        this.funcname = null;
    }
    DShellTestResult.tableToObject = function (row) {
        return new DShellTestResult(row.result_id, row.version, row.result, row.failure_acceptable, row.timestamp);
    };

    DShellTestResult.prototype.setTestItemInfo = function () {
    };
    return DShellTestResult;
})();
exports.DShellTestResult = DShellTestResult;

