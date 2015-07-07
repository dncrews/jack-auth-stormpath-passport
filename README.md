# jack-auth-stormpath-passport
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

This Jack-Stack Plugin sets up stormpath-passport for user management


## Configuration
For anything to work, you'll need to set your stormpath credentials either directly:

```js
jack.use(require('jack-auth-stormpath-passport').configure({
  apiKeyId: 'something',
  apiKeySecret: 'something',
  appHref: 'something',
}));
```

or through `node-config`:
```js
{
  stormpath: {
    apiKeyId: 'something',
    apiKeySecret: 'something',
    appHref: 'something',
  }
}
```

There are some additional optional parameters you may use:
- `restful` - Causes the login/logout responses to send HTTP Status Codes, instead of HTML
- `callNext` - Prevents the login/logout responses from responding. Instead each calls express `next`
- `passport` - Any additional configuration you want to pass into `passport.authenticate`

[npm-image]: https://img.shields.io/npm/v/jack-auth-stormpath-passport.svg
[npm-url]: https://www.npmjs.org/package/jack-auth-stormpath-passport
[downloads-image]: https://img.shields.io/npm/dm/jack-auth-stormpath-passport.svg
[downloads-url]: https://www.npmjs.org/package/jack-auth-stormpath-passport
