import * as Joi from 'joi';
import { AnySchema } from 'joi';

import { host } from '@schemas/host.schema';
import { port } from '@schemas/port.schema';
import { username } from '@schemas/username.schema';
import { password } from '@schemas/password.schema';

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