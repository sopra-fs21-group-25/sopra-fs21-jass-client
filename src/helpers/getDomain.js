import { isProduction } from './isProduction';

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production Heroku URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = 'https://sopra-fs21-group-25-server.herokuapp.com';
  const devUrl = 'http://localhost:8080';

  return isProduction() ? prodUrl : devUrl;
};

export const getWebsocketDomain = () => {
  const prodUrl = 'wss://sopra-fs21-group-25-server.herokuapp.com';
  const devUrl = 'ws://localhost:8080';

  return isProduction() ? prodUrl : devUrl;
}
