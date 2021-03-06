const { assert } = require('chai');
const { create: createServer } = require('./fixture/server');
const { makeIdToken } = require('./fixture/cert');
const { auth } = require('./..');

const request = require('request-promise-native').defaults({
  simple: false,
  resolveWithFullResponse: true,
});

const defaultConfig = {
  clientID: '__test_client_id__',
  baseURL: 'http://example.org',
  issuerBaseURL: 'https://op.example.com',
  secret: '__test_session_secret__',
  authRequired: false,
};

const login = async (baseUrl = 'http://localhost:3000', idToken) => {
  const jar = request.jar();
  await request.post({
    uri: '/session',
    json: {
      id_token: idToken || makeIdToken(),
    },
    baseUrl,
    jar,
  });

  const session = (
    await request.get({ uri: '/session', baseUrl, jar, json: true })
  ).body;
  return { jar, session };
};

const logout = async (jar, baseUrl = 'http://localhost:3000') => {
  const response = await request.get({
    uri: '/logout',
    baseUrl,
    jar,
    followRedirect: false,
  });
  const session = (
    await request.get({ uri: '/session', baseUrl, jar, json: true })
  ).body;
  return { response, session };
};

describe('logout route', async () => {
  let server;

  afterEach(async () => {
    if (server) {
      server.close();
    }
  });

  it('should perform a local logout', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        idpLogout: false,
      })
    );

    const { jar, session: loggedInSession } = await login();
    assert.ok(loggedInSession.id_token);
    const { response, session: loggedOutSession } = await logout(jar);
    assert.notOk(loggedOutSession.id_token);
    assert.equal(response.statusCode, 302);
    assert.include(
      response.headers,
      {
        location: 'http://example.org',
      },
      'should redirect to the base url'
    );
  });

  it('should perform a distributed logout', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        idpLogout: true,
      })
    );

    const idToken = makeIdToken();
    const { jar } = await login('http://localhost:3000', idToken);
    const { response, session: loggedOutSession } = await logout(jar);
    assert.notOk(loggedOutSession.id_token);
    assert.equal(response.statusCode, 302);
    assert.include(
      response.headers,
      {
        location: `https://op.example.com/session/end?post_logout_redirect_uri=http%3A%2F%2Fexample.org&id_token_hint=${idToken}`,
      },
      'should redirect to the identity provider'
    );
  });

  it('should perform an authok logout', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        issuerBaseURL: 'https://test.eu.authok.com',
        idpLogout: true,
        authokLogout: true,
      })
    );

    const { jar } = await login();
    const { response, session: loggedOutSession } = await logout(jar);
    assert.notOk(loggedOutSession.id_token);
    assert.equal(response.statusCode, 302);
    assert.include(
      response.headers,
      {
        location:
          'https://op.example.com/logout?return_to=http%3A%2F%2Fexample.org&client_id=__test_client_id__',
      },
      'should redirect to the identity provider'
    );
  });

  it('should redirect to postLogoutRedirect', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        routes: {
          postLogoutRedirect: '/after-logout-in-auth-config',
        },
      })
    );

    const { jar } = await login();
    const { response, session: loggedOutSession } = await logout(jar);
    assert.notOk(loggedOutSession.id_token);
    assert.equal(response.statusCode, 302);
    assert.include(
      response.headers,
      {
        location: 'http://example.org/after-logout-in-auth-config',
      },
      'should redirect to postLogoutRedirect'
    );
  });

  it('should redirect to the specified return_to', async () => {
    const router = auth({
      ...defaultConfig,
      routes: {
        logout: false,
        postLogoutRedirect: '/after-logout-in-auth-config',
      },
    });
    server = await createServer(router);
    router.get('/logout', (req, res) =>
      res.oidc.logout({ return_to: 'http://www.another-example.org/logout' })
    );

    const { jar } = await login();
    const { response, session: loggedOutSession } = await logout(jar);
    assert.notOk(loggedOutSession.id_token);
    assert.equal(response.statusCode, 302);
    assert.include(
      response.headers,
      {
        location: 'http://www.another-example.org/logout',
      },
      'should redirect to params.return_to'
    );
  });

  it('should logout when scoped to a sub path', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        session: {
          cookie: {
            path: '/foo',
          },
        },
      }),
      null,
      '/foo'
    );
    const baseUrl = 'http://localhost:3000/foo';

    const { jar, session: loggedInSession } = await login(baseUrl);
    assert.ok(loggedInSession.id_token);
    const sessionCookie = jar
      .getCookies('http://localhost:3000/foo')
      .find(({ key }) => key === 'appSession');
    assert.equal(sessionCookie.path, '/foo');
    const { session: loggedOutSession } = await logout(jar, baseUrl);
    assert.notOk(loggedOutSession.id_token);
  });

  it('should cancel silent logins when user logs out', async () => {
    server = await createServer(auth(defaultConfig));

    const { jar } = await login();
    const baseUrl = 'http://localhost:3000';
    assert.notOk(
      jar.getCookies(baseUrl).find(({ key }) => key === 'skipSilentLogin')
    );
    await logout(jar);
    assert.ok(
      jar.getCookies(baseUrl).find(({ key }) => key === 'skipSilentLogin')
    );
  });
});
