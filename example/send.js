var pony = require('pony');

var opts = {
    host : 'localhost',
    port : 25,
    from : 'substack',
    to : 'root',
};

pony(opts, function (err, req) {
    if (err) return console.error(err)
    
    req.setHeader('content-type', 'text/plain');
    req.setHeader('subject', 'greetings');
    req.end('oh hello');
});
