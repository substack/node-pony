var send = require('../')({
    host : 'localhost',
    port : 25,
    from : 'substack',
});

send({ to : 'root' }, function (err, req) {
    if (err) console.error(err)
    else {
        req.setHeader('content-type', 'text/plain');
        req.setHeader('subject', 'protip');
        req.end('curry is tasty');
    }
});
