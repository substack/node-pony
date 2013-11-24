#!/usr/bin/env node

var pony = require('../');
var minimist = require('minimist');
var copy = require('copy');
var os = require('os');
var fs = require('fs');

var argv = minimist(process.argv.slice(2), {
    default: {
        host: 'localhost',
        port: 25,
        from: process.env.EMAIL || (process.env.USER + '@' + os.hostname())
    },
    alias: {
        host: 'h',
        port: 'p',
        from: 'f',
        to: 't',
        header: 'H',
        subject: 's'
    }
});

if (argv.help || process.argv.length === 2) {
    fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
    return;
}

var addrTo = argv._.concat(argv.to).filter(Boolean);

if (addrTo.length === 0) {
    console.error('pony requires at least one message recipient)');
    process.exit(1);
}

addrTo.forEach(function (to) {
    var opts = copy(argv);
    opts.to = to;
    var req = pony(opts);
    if (argv.subject) req.setHeader('subject', argv.subject);
    if (argv.cc) req.setHeader('cc', toArray(argv.cc).join(', '));
    
    toArray(argv.header).forEach(function (h) {
        req.setHeader(h.split(/\s*:/)[0], h.replace(/^[^:]*:\s*/, ''));
    });
    process.stdin.pipe(req);
});

function toArray (xs) {
    if (Array.isArray(xs)) return xs;
    return xs ? [ xs ] : [];
}
