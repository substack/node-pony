#!/usr/bin/env node

var pony = require('../');
var minimist = require('minimist');
var os = require('os');

var argv = minimist(process.argv.slice(2), {
    default: {
        host: 'localhost',
        port: 25,
        from: process.env.USER + '@' + os.hostname()
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

if (!argv.to) {
    console.error('pony requires at least one message recipient (--to)');
    process.exit(1);
}

toArray(argv.to).forEach(function (to) {
    var req = pony(argv);
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
