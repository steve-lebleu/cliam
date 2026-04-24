import Joi from 'joi';
import type { AnySchema } from 'joi';

const username = (): AnySchema => {
  return Joi.string().max(32);
};

export { username }
