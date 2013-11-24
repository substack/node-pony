# pony

Send email and a pony.

[![build status](https://secure.travis-ci.org/substack/node-pony.png)](http://travis-ci.org/substack/node-pony)

![pony](http://substack.net/images/pony.png)

# example

``` js
var pony = require('pony');

var mail = pony({
    host : 'localhost',
    port : 25,
    from : 'substack',
    to : 'root',
});
mail.setHeader('content-type', 'text/plain');
mail.setHeader('subject', 'greetings');
mail.end('oh hello');
```

# methods

``` js
var pony = require('pony')
```

## var req = pony(params, cb)

Send an email with some parameters `params`.

An optional callback `cb(err, req)` will fire once the initial handshake is
complete.

## request object

The request object is a stream that behaves like the `req` you get from
`http.createServer()`.

SMTP messages are a lot like is HTTP messages is why.

## req.setHeader(key, value)

Use `setHeader()` to set the `'content-type'`, `'subject'`, and such things
relevant to emails.

## req.removeHeader(key)

Remove a header.

## req.write(data)

Write a string or Buffer to the message body after the headers.

## req.end(data)

End the message body, optionally writing an additional Buffer or string `data`
first.

# install

With [npm](http://npmjs.org) do:

```
npm install pony
```

# tests

With [npm](https://npmjs.org) do:

```
npm test
```

# pony comics

[more shetland pony adventures](http://harkavagrant.com/index.php?id=131)

[pony returns](http://www.harkavagrant.com/index.php?id=284)

# license

MIT
