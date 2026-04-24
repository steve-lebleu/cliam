import Joi from 'joi';
import type { AnySchema } from 'joi';

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
  return types.find(h => h.type === type)!.schema;
};

export { password }
