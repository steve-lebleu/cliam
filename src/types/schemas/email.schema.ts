import * as Joi from 'joi';
import type { AnySchema } from 'joi';

const email = (): AnySchema => {
  return Joi.string().email();
};

export { email }