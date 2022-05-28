const jo = require('jpeg-autorotate');

module.exports = options =>
  input =>
    jo.rotate(input, options)
      .then(({ buffer }) => buffer)
      .catch(() => input);
