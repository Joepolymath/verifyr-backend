const Ajv = require('ajv');

const ajv = new Ajv();
const schema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    username: { type: 'string' }
  },
  required: ['userId', 'username']
};
const validate = ajv.compile(schema);

module.exports = validate;
