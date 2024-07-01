export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response("<h1>🎉Cloudflare Docker Proxy is Running!</h1><a href='https://github.com/Whirity404/cloudflare-dockerhub-proxy'>Github</a><br><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=2155423468&auto=1&height=66"></iframe>", {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/token') {
      const authUrl = 'https://auth.docker.io/token' + url.search;
      const authRequest = new Request(authUrl, request);
      return fetch(authRequest);
    }

    url.hostname = 'registry-1.docker.io';
    const modifiedRequest = new Request(url.toString(), request);

    let response = await fetch(modifiedRequest);

    const authHeader = response.headers.get('Www-Authenticate');
    if (authHeader) {
      const requestUrl = new URL(request.url);
      const newRealm = `https://${requestUrl.hostname}/token`;
      const modifiedAuthHeader = authHeader.replace(/realm="https:\/\/[^"]+"/, `realm="${newRealm}"`);
      response = new Response(response.body, response);
      response.headers.set('Www-Authenticate', modifiedAuthHeader);
    }
    return response;
  }
};
