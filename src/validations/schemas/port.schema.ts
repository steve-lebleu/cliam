import Joi from 'joi';
import type { AnySchema } from 'joi';

const port = (): AnySchema => {
  return Joi.number().port().default(587);
};

export { port }
