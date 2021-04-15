const chance = require('chance').Chance();

module.exports = (provider = 'sendinblue', key = chance.string( { length: 8 } ), token = 'ad45da106a1d867e86b1345d65fda066', templates = {}) => {
  return {
    "credentials": {
      "apiKey": key,
      "token": token,
    },
    "name": provider,
    "templates": templates
  }
};
