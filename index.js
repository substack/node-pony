var smtp = require('smtp-protocol');
var seq = require('seq');
var Request = require('./lib/request');

module.exports = function (params, cb) {
    var finished = false;
    
    var c = smtp.connect(params.host, params.port, function (mail) {
        seq()
            .seq(function () {
                mail.on('greeting', this.ok);
            })
            .seq(function (code, lines) {
                if (!(code >= 200 && code < 300)) {
                    cb('greeting code not ok: '
                        + code + ': ' + lines.join(' ')
                    );
                    mail.quit();
                }
                else mail.helo(params.domain || 'localhost', this);
            })
            .seq(function (code, lines) {
                if (!(code >= 200 && code < 300)) {
                    cb('HELO not ok: ' + code + ': ' + lines.join(' '));
                    mail.quit();
                }
                else mail.from(params.from, this);
            })
            .seq(function (code, lines) {
                if (!(code >= 200 && code < 300)) {
                    cb('FROM not ok: ' + code + ': ' + lines.join(' '));
                    mail.quit();
                }
                else mail.to(params.to, this);
            })
            .seq(function (code, lines) {
                if (!(code >= 200 && code < 300)) {
                    cb('TO not ok: ' + code + ': ' + lines.join(' '));
                    mail.quit();
                }
                else mail.data(this);
            })
            .seq_(function (next, code, latest) {
                if (code != 354) {
                    cb('DATA not ok: ' + code + ': ' + lines.join(' '));
                    mail.quit();
                }
                else {
                    var req = new Request;
                    mail.message(req, function (err, code, lines) {
                        if (err) {
                            cb(err);
                            mail.quit();
                        }
                        else if (!(code >= 200 && code < 300)) {
                            req.emit('error', new Error(
                                'message rejected: '
                                + code + ' ' + lines.join(' ')
                            ));
                        }
                        else next()
                    });
                    cb(null, req);
                }
            })
            .catch(function (err) {
                cb(err);
                mail.quit();
            })
            .seq(function () {
                mail.quit();
                finished = true;
            })
        ;
    });
    
    c.on('error', cb);
    c.on('end', function () {
        if (!finished) cb('connection terminated early');
    });
    
    return c;
};
