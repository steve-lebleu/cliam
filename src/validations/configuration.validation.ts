import * as Joi from 'joi';

import { smtp as smtpSchema } from '../types/schemas/smtp.schema';
import { host } from '../types/schemas/host.schema';
import { port } from '../types/schemas/port.schema';
import { username } from '../types/schemas/username.schema';
import { password } from '../types/schemas/password.schema';

import { list } from '../utils/enum.util';

import { PROVIDER } from '../types/enums/provider.enum';
import { SOCIAL_NETWORK } from '../types/enums/social-network.enum';

const configurationSchema = Joi.object({
  sandbox: Joi.boolean().default(false),
  variables: Joi.object({
    domain: Joi.string().uri().required(),
    addresses: Joi.object({
      from: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(48).required()
      }).required(),
      replyTo: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(48).required()
      }).required()
    }),
  }).required(),
  placeholders: Joi.object({
    company: Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
      email: Joi.string().email(),
      phone: Joi.string(),
      location: Joi.object({
        street: Joi.string().required(),
        num: Joi.string().required(),
        zip: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required()
      }),
      socials: Joi.array().items(
        Joi.object({
          name: Joi.any().valid( ...list(SOCIAL_NETWORK) ).required(),
          url: Joi.string().uri().required()
        })
      ),
    }).required(),
    theme: Joi.object({
      logo: Joi.string().uri().required(),
      primaryColor: Joi.string().hex().required(),
      secondaryColor: Joi.string().hex().required(),
      tertiaryColor: Joi.string().hex().required(),
      quaternaryColor: Joi.string().hex().required(),
    }).required()
  }).optional(),
  transporters: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        provider: Joi.any().valid( ...list(PROVIDER) ),
        auth: Joi.object({
          username: Joi.any().when('..provider', {
            switch: [
              {
                is: !Joi.exist(),
                then: username().required(),
                otherwise: username().optional()
              }
            ]
          }),
          password: Joi.any().when('..provider', {
            switch: [
              {
                is: !Joi.exist(),
                then: password('smtp').required(),
                otherwise: password('smtp').optional()
              }
            ]
          }),
          apiKey: Joi.string().when('...provider', {
            switch: [
              {
                is: Joi.any().valid(PROVIDER.mailgun).required(),
                then: Joi.string().regex(/^[a-z-0-9]{32}-[a-z-0-9]{8}-[a-z-0-9]{8}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.mailjet).required(),
                then: Joi.string().regex(/^[a-z-0-9]{32}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.sparkpost).required(),
                then: Joi.string().regex(/^[a-z-0-9]{40}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.mailersend).required(),
                then: Joi.string().regex(/^mlsn.[a-z-0-9]{64}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.sendinblue).required(),
                then: Joi.string().regex(/^xkeysib-[a-z-0-9]{64}-[a-z-A-Z-0-9]{16}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.brevo).required(),
                then: Joi.string().regex(/^xkeysib-[a-z-0-9]{64}-[a-z-A-Z-0-9]{16}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.sendgrid).required(),
                then: Joi.string().regex(/^[a-z-A-Z-0-9\\-\\.\\_]{69}$/)
              },
              {
                is: Joi.any().valid(PROVIDER.postmark).required(),
                then: Joi.string().regex(/^[a-z-0-9]{8}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{12}$/)
              },
            ]
          }).concat(Joi.string().when('...provider', {
            is: Joi.exist(),
            then: Joi.string().required()
          })),
          apiSecret: Joi.string().when('...provider', {
            is: Joi.any().valid(PROVIDER.mailjet).required(),
            then: Joi.string().regex(/^[a-z-0-9]{32}$/),
          })
        }).xor('username', 'apiKey').xor('password', 'apiKey').required(),
        options: Joi.object().when('provider', {
          not: Joi.exist(),
          then: Joi.object({
            host: host('smtp').required(),
            port: port().required(),
            secure: Joi.boolean().default(false),
          }).required()

        }),
        templates: Joi.object().pattern( Joi.string(), Joi.when('.provider', {
          switch: [
            {
              is: Joi.any().valid(PROVIDER.mailgun).required(),
              then: Joi.string()
            },
            {
              is: Joi.any().valid(PROVIDER.mailjet).required(),
              then: Joi.string().regex(/^[0-9]{8}$/)
            },
            {
              is: Joi.any().valid(PROVIDER.sparkpost).required(),
              then: Joi.string()
            },
            {
              is: Joi.any().valid(PROVIDER.mailersend).required(),
              then: Joi.string()
            },
            {
              is: Joi.any().valid(PROVIDER.brevo).required(),
              then: Joi.number()
            },
            {
              is: Joi.any().valid(PROVIDER.sendinblue).required(),
              then: Joi.number()
            },
            {
              is: Joi.any().valid(PROVIDER.sendgrid).required(),
              then: Joi.string().regex(/^d-[a-z0-9]{32}$/)
            },
            {
              is: Joi.any().valid(PROVIDER.postmark).required(),
              then: Joi.string()
            }
          ]
        }))
      })
    )
    .min(1).required()
    .unique((a, b) => a.id === b.id).required(),
});

export { configurationSchema }
