[![Unix Build Status][ci-img]][ci-url]
[![Windows Build Status][ci-win-img]][ci-win-url]
[![Code Climate][clim-img]][clim-url]
[![NPM][npm-img]][npm-url]

# haraka-plugin-batv

This Bounce Address Tag Validation plugin prevents being "spammed" by bounce messages. Bounce messages which aren't actually responses to messages that the user have sent out can be blocked with this SRS integration.
It automatically changes the user of the sender for outgoing e-mails, by adding a generated key. And when an e-mail is recived with an empty sender (a bounce e-mail), by using the mentioned key, it checks whether it is a legitimate bounce message (a reply to a previous outgoing message). If it is a spam, drops it, if not, decodes the e-mail address and forwards it to the correct user.

This plugin uses srs.js script directly. For more information, please check: https://www.npmjs.com/package/srs.js

& IMPORTANT: this plugin must appear in  `config/plugins`  before other plugins that run on hook_rcpt

## How it works
Assume that the user uses the address example@domain.com and will send an e-mail.

Before the e-mail is sent, example@domain.com will automatically change to:
SRS0=HHH=TT=domain.com=example@domain.com

If the e-mail bounces, after checking if the key is correct or not or whether there is a key at all, it will be forwarded to example@domain.com.


## Configuration
Please select a secret key and (optionally) a maxAge and save it in the config/batv.ini file. Default configuration:
```
[srs]
secret=asecretkey
maxAgeDays=21
```



<!-- leave these buried at the bottom of the document -->
[ci-img]: https://github.com/haraka/haraka-plugin-batv/workflows/Plugin%20Tests/badge.svg
[ci-url]: https://github.com/haraka/haraka-plugin-batv/actions?query=workflow%3A%22Plugin+Tests%22
[ci-win-img]: https://github.com/haraka/haraka-plugin-batv/workflows/Plugin%20Tests%20-%20Windows/badge.svg
[ci-win-url]: https://github.com/haraka/haraka-plugin-batv/actions?query=workflow%3A%22Plugin+Tests+-+Windows%22
[clim-img]: https://codeclimate.com/github/haraka/haraka-plugin-batv/badges/gpa.svg
[clim-url]: https://codeclimate.com/github/haraka/haraka-plugin-batv
[npm-img]: https://nodei.co/npm/haraka-plugin-batv.png
[npm-url]: https://www.npmjs.com/package/haraka-plugin-batv
