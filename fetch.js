const { stringifyParams } = require("./utils.js");

const catchErrors = fetch => (input, init) => fetch(input, init)
  .then(resp => {
    if (!resp.ok) {
      throw new Error(resp);
    }

    return resp;
  })
  .catch(err => err);

const jsonResponse = resp => {
  if (!resp || typeof resp.json !== "function" || resp.headers.get("Content-Type").indexOf("application/json") === -1) {
    return new Error(resp);
  }

  return resp.json();
};

const parseJson = fetch => (input, init) =>
  fetch(input, init).then(jsonResponse);

const prefix = prefix => fetch => (input, init) => fetch(
  prefix + (typeof input === "string" ? input : input.url),
  init
);

const stringifySearch = fetch => (input, { search, ...init }) =>
  fetch(input + stringifyParams(search), init);

module.exports = {
  catchErrors,
  jsonResponse,
  parseJson,
  prefix,
  stringifySearch,
};
