# Express OpenID Connect

Express JS middleware implementing sign on for Express web apps using OpenID Connect.

[![CircleCI](https://img.shields.io/circleci/build/github/authok/express-openid-connect/master?style=flat-square)](https://circleci.com/gh/authok/express-openid-connect/tree/master)
[![codecov](https://img.shields.io/codecov/c/github/authok/express-openid-connect?style=flat-square)](https://codecov.io/gh/authok/express-openid-connect)
[![NPM version](https://img.shields.io/npm/v/express-openid-connect.svg?style=flat-square)](https://npmjs.org/package/express-openid-connect)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fauthok%2Fexpress-openid-connect.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fauthok%2Fexpress-openid-connect?ref=badge_shield)

## Table of Contents

- [Documentation](#documentation)
- [Install](#install)
- [Getting Started](#getting-started)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](#contributing)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [FAQs](./FAQ.md)
- [Support + Feedback](#support--feedback)
- [Vulnerability Reporting](#vulnerability-reporting)
- [What is Authok](#what-is-authok)
- [License](#license)

## Documentation

- Our [Express Quickstart](https://authok.com/docs/quickstart/webapp/express) is the quickest way to get up and running from scratch.
- Use the [Examples for common configurations](https://github.com/authok/express-openid-connect/blob/master/EXAMPLES.md) for use cases beyond the basics.
- The [API documentation](https://authok.github.io/express-openid-connect) details all configuration options, methods, and data that this library provides.
- You can [run the sample application](https://github.com/authok-samples/authok-express-webapp-sample/tree/master) to see how this SDK functions without writing your own integration.

## Install

Node.js version **>=12.0.0** is recommended, but **^10.19.0** lts/dubnium is also supported.

```bash
npm install express-openid-connect
```

## Getting Started

Follow our [Secure Local Development guide](https://authok.com/docs/libraries/secure-local-development) to ensure that applications using this library are running over secure channels (HTTPS URLs). Applications using this library without HTTPS may experience "invalid state" errors.

The library needs [issuerBaseURL](https://authok.github.io/express-openid-connect/interfaces/configparams.html#issuerbaseurl), [baseURL](https://authok.github.io/express-openid-connect/interfaces/configparams.html#baseurl), [clientID](https://authok.github.io/express-openid-connect/interfaces/configparams.html#clientid) and [secret](https://authok.github.io/express-openid-connect/interfaces/configparams.html#secret) to request and accept authentication. These can be configured with environmental variables:

```text
ISSUER_BASE_URL=https://YOUR_DOMAIN
CLIENT_ID=YOUR_CLIENT_ID
BASE_URL=https://YOUR_APPLICATION_ROOT_URL
SECRET=LONG_RANDOM_VALUE
```

... or in the library initialization:

```js
// index.js

const { auth } = require('express-openid-connect');
app.use(
  auth({
    issuerBaseURL: 'https://YOUR_DOMAIN',
    baseURL: 'https://YOUR_APPLICATION_ROOT_URL',
    clientID: 'YOUR_CLIENT_ID',
    secret: 'LONG_RANDOM_STRING',
    idpLogout: true,
  })
);
```

With this basic configuration, your application will require authentication for all routes and store the user identity in an encrypted and signed cookie.

See the [examples](EXAMPLES.md) for route-specific authentication, custom application session handling, requesting and using access tokens for external APIs, and more.

See the [API documentation](https://authok.github.io/express-openid-connect) for [additional configuration possibilities](https://authok.github.io/express-openid-connect/interfaces/configparams.html) and [provided methods](https://authok.github.io/express-openid-connect/globals.html#attemptsilentlogin).

## A note on error handling

Errors raised by this library are handled by the [default Express error handler](https://expressjs.com/en/guide/error-handling.html#the-default-error-handler) which, in the interests of security, does not include the stack trace or error message in the production environment. If you write your own error handler, you should not render the error message without using a templating engine that will properly escape it first.

To write your own error handler, see the Express documentation on writing [Custom error handlers](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers). 

## Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Authok's general contribution guidelines](https://github.com/authok/.github/blob/master/CONTRIBUTING.md)
- [Authok's code of conduct guidelines](https://github.com/authok/open-source-template/blob/master/CODE-OF-CONDUCT.md)

Contributions can be made to this library through PRs to fix issues, improve documentation or add features. Please fork this repo, create a well-named branch, and submit a PR with a complete template filled out.

Code changes in PRs should be accompanied by tests covering the changed or added functionality. Tests can be run for this library with:

```bash
npm install
npm test
```

When you're ready to push your changes, please run the lint command first:

```bash
npm run lint
```

## Support + Feedback

Please use the [Issues queue](https://github.com/authok/express-openid-connect/issues) in this repo for questions and feedback.

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://authok.com/whitehat) details the procedure for disclosing security issues.

## What is Authok?

Authok helps you to easily:

- implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- log in users with username/password databases, passwordless, or multi-factor authentication
- link multiple user accounts together
- generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- access demographics and analytics detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript rules

[Why Authok?](https://authok.com/why-authok)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fauthok%2Fexpress-openid-connect.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fauthok%2Fexpress-openid-connect?ref=badge_large)
