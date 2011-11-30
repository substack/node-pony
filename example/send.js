var send = require('../');

var opts = {
    host : 'localhost',
    port : 25,
    from : 'substack',
    to : 'root',
};
send(opts, function (err, req) {
    if (err) console.error(err)
    else {
        req.setHeader('content-type', 'text/plain');
        req.setHeader('subject', 'greetings');
        req.end('oh hello');
    }
});
