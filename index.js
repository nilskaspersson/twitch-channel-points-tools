require("dotenv").config();

const nodeFetch = require("node-fetch");
const WebSocket = require("ws");

const { compose
      , generateNonce } = require("./utils.js");
const { catchErrors
      , parseJson
      , stringifySearch } = require("./fetch.js");

const AUTH_API  = "https://id.twitch.tv/oauth2";
const HELIX_API = "https://api.twitch.tv/helix";

const fetch = compose(
  parseJson,
  catchErrors,
  stringifySearch,
)(nodeFetch);

(async ({ channel_id, client_id, client_secret, auth_token, channel }) => {
  const { access_token, expires_in } = await fetch(`${AUTH_API}/token`, {
    method: "POST",
    search: {
      client_id,
      client_secret,
      grant_type: "client_credentials",
      scope: "channel:read:redemptions",
    }
  });

  const client = new WebSocket("wss://pubsub-edge.twitch.tv");

  const requestListen = topic => JSON.stringify({
    type  : "LISTEN",
    nonce : generateNonce(15),
    data  : ({
      topics: [topic],
      auth_token: access_token,
    })
  });

  client.on("open", () => {
    client.send(requestListen(`channel-points-channel-v1.${channel_id}`));
  });

  client.on("message", resp => {
    console.log(JSON.parse(resp));
  });

})(process.env);
