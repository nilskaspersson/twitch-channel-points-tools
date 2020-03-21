const crypto = require("crypto");

const generateNonce = ln => crypto.randomBytes(ln).toString("hex");

const compose = (...fns) =>
  fns.reduce((acc, fn) => (...args) => acc(fn(...args)));

const stringifyParams = object =>
  (str => (str ? `?${str}` : ""))(
    Object.entries(object)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")
  );

module.exports = {
  compose,
  generateNonce,
  stringifyParams,
};
