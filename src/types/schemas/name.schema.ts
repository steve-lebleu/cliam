import * as Joi from 'joi';
import type { AnySchema } from 'joi';

const name = (): AnySchema => {
  return Joi.string().max(32);
};

export { name }