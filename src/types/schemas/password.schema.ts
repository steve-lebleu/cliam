import * as Joi from 'joi';
import { AnySchema } from 'joi';

const password = (type: string): AnySchema => {
  const types = [
    {
      type: 'user',
      schema: Joi.string().min(8).max(24)
    },
    {
      type: 'smtp',
      schema: Joi.string().min(8).max(24)
    }
  ];
  return types.filter( h => h.type === type ).slice().shift().schema;
};

export { password }