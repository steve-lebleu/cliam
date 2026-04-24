import Joi from 'joi';
import type { AnySchema } from 'joi';

const host = (type: string = 'smtp'): AnySchema => {
  const types = [
    {
      type: 'smtp',
      // biome-ignore lint/complexity/noUselessEscapeInRegex: Joi requires explicit hyphen escape inside character class
      schema: Joi.string().regex(/^[a-z-0-9\-]{2,12}\.[a-z]{2,16}\.[a-z]{2,8}$/i)
    }
  ];

  return types.find(h => h.type === type)!.schema;
};

export { host }
