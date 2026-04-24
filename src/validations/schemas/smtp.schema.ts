import Joi from 'joi';
import type { AnySchema } from 'joi';

import { host } from './host.schema';
import { password } from './password.schema';
import { port } from './port.schema';
import { username } from './username.schema';

const smtp = (): AnySchema => {
  return Joi.object({
    host: host('smtp').required(),
    port: port().required(),
    secure: Joi.boolean().default(false),
    username: username().required(),
    password: password('smtp').required(),
  });
};

export { smtp };
