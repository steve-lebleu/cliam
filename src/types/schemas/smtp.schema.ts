import * as Joi from 'joi';
import { AnySchema } from 'joi';

import { host } from './host.schema';
import { port } from './port.schema';
import { username } from './username.schema';
import { password } from './password.schema';

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