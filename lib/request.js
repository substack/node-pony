var Stream = require('net').Stream;
var util = require('util');

function Request () {
    this.writable = true;
    this.readable = true;
}
module.exports = Request;
util.inherits(Request, Stream);

Request.prototype.setHeader = function (key, value) {
    if (this.written) throw new Error("can't set headers after write()");
    if (!this.headers) this.headers = {};
    this.headers[key] = value;
};

Request.prototype.removeHeader = function (key) {
    if (this.written) throw new Error("can't remove headers after write()");
    if (!this.headers) this.headers = {};
    delete this.headers[key];
};

Request.prototype.write = function (buf) {
    var headers = this.headers;
    if (!this.written && headers) {
        this.emit('data', new Buffer(
            Object.keys(headers)
                .map(function (key) {
                    return escape(key) + ': ' + escape(headers[key])
                })
                .concat('')
                .join('\r\n')
        ));
    }
    this.written = true;
    
    this.emit('data', buf);
};

Request.prototype.end = function (buf) {
    if (buf !== undefined) this.write(buf);
    this.emit('end');
};
