var pony = require('../');

var mail = pony({
    host : 'localhost',
    port : 25,
    from : 'substack',
    to : 'root'
});
mail.setHeader('content-type', 'text/plain');
mail.setHeader('subject', 'greetings');
mail.end('oh hello');
