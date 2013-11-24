var Transform = require('readable-stream').Transform;
var inherits = require('inherits');

module.exports = Request;
inherits(Request, Transform);

function Request () {
    if (!(this instanceof Request)) return new Request;
    Transform.call(this);
}

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

Request.prototype._transform = function (buf, enc, next) {
    var headers = this.headers;
    if (!this.written && headers) {
        this.push(new Buffer(
            Object.keys(headers)
                .map(function (key) {
                    return guard(key) + ': ' + guard(headers[key])
                })
                .concat('', '')
                .join('\r\n')
        ));
    }
    this.written = true;
    this.push(buf);
    next();
};

function guard (s) {
    return s.replace(/[:\r\n]/, function (x) {
        return '%' + x.charCodeAt(0).toString(16);
    });
};
