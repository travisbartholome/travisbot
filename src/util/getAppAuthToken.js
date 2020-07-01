const axios = require('axios').default;

const { twitchApi } = require('../../config');

const { clientId, clientSecret } = twitchApi;

// Reference for OAuth app access token generation:
// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-client-credentials-flow
const postData = {};
module.exports = () => axios.post('https://id.twitch.tv/oauth2/token', postData, {
  params: {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  },
  // Optional param: scope
}).then(({ data }) => {
  // Get app access token from response data and return
  const { access_token: accessToken } = data;
  return Promise.resolve(accessToken);
}).catch(console.error);
