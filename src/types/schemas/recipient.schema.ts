import * as Joi from 'joi';
import { AnySchema } from 'joi';

const recipient = (): AnySchema => {
  return Joi.alternatives().try(
    Joi.string().email().required(),
    Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().max(48)
    }).required()
  )
};

export { recipient }