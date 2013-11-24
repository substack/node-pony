var smtp = require('smtp-protocol');
var Request = require('./lib/request');

module.exports = function pony (params, cb) {
    var mail, finished = false;
    
    if (!cb) cb = function (err) {
        if (err) req.emit('error', err);
    }
    
    cb = (function (cb_) {
        return function () {
            cb = function () {};
            return cb_.apply(this, arguments);
        };
    })(cb);
    
    var c = smtp.connect(params.host, params.port, function (mail_) {
        mail = mail_;
        mail.on('greeting', function (code, lines) {
            if (code < 200 || code >= 300) {
                error('greeting code not ok', code, lines);
            }
            else mail.helo(params.domain || 'localhost', onhelo);
        });
    });
    
    c.on('error', function (err) {
        cb(err);
        if (mail) mail.quit();
        cb = function () {};
    });
    
    c.on('end', function () {
        if (!finished) cb('connection terminated early');
    });
    
    var req = new Request;
    return req;
    
    function error (msg, code, lines) {
        var s = msg + ': ' + lines.join(' ');
        var err = new Error(s);
        err.code = code;
        err.lines = lines;
        err.message = s;
        finished = true;
        cb(err);
        if (mail) mail.quit();
    }
    
    function onhelo (err, code, lines) {
        if (code < 200 || code >= 300) {
            error('HELO not ok', code, lines);
        }
        else mail.from(params.from, onfrom);
    }
    
    function onfrom (err, code, lines) {
        if (code < 200 || code >= 300) {
            error('FROM not ok', code, lines);
        }
        else mail.to(params.to, onto);
    }
    
    function onto (err, code, lines) {
        if (code < 200 || code >= 300) {
            error('TO not ok', code, lines);
        }
        else mail.data(ondata)
    }
    
    function ondata (err, code, lines) {
        if (code != 354) {
            return error('DATA not ok', code, lines);
        }
        mail.message(req, function (err, code, lines) {
            finished = true;
            
            if (err) return req.emit('error', err);
            req.emit('code', code, lines);
            
            if (code < 200 || code >= 300) {
                req.emit('error', new Error(
                    'message rejected: '
                    + code + ' ' + lines.join(' ')
                ));
            }
            else mail.quit();
        });
        cb(null, req);
    }
};
