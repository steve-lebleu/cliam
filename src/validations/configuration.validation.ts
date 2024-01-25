import * as Joi from 'joi';

import { smtp as smtpSchema } from '../types/schemas/smtp.schema';

import { list } from '../utils/enum.util';
import { TRANSPORTER } from '../types/enums/transporter.enum';
import { SOCIAL_NETWORK } from '../types/enums/social-network.enum';

const configurationSchema = Joi.object({
  sandbox: Joi.object({
    active: Joi.boolean().default(false),
    from: Joi.when('active', {
      is: true,
      then: Joi.object({
        name: Joi.string().max(48).required(),
        email: Joi.string().email().required()
      }).required(),
      otherwise: Joi.optional()
    }),
    to: Joi.when('active', {
      is: true,
      then: Joi.object({
        name: Joi.string().max(48).required(),
        email: Joi.string().email().required()
      }).required(),
      otherwise: Joi.optional()
    })
  }),
  consumer: Joi.object({
    domain: Joi.string().uri().required(),
    company: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    addresses: Joi.object({
      from: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(48).required()
      }),
      replyTo: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(48).required()
      })
    }),
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
    theme: Joi.object({
      logo: Joi.string().uri().required(),
      primaryColor: Joi.string().hex().required(),
      secondaryColor: Joi.string().hex().required(),
      tertiaryColor: Joi.string().hex().required(),
      quaternaryColor: Joi.string().hex().required(),
    })
  }).required(),
  mode: Joi.object().keys({
    api: Joi.object({
      name: Joi.any().valid( ...list(TRANSPORTER) ).required(),
      credentials: Joi.object({
        apiKey: Joi.string().when('...name', {
          switch: [
            {
              is: Joi.any().valid(TRANSPORTER.mailgun).required(),
              then: Joi.string().regex(/^[a-z-0-9]{32}-[a-z-0-9]{8}-[a-z-0-9]{8}$/)
            },
            {
              is: Joi.any().valid(TRANSPORTER.mailjet).required(),
              then: Joi.string().regex(/^[a-z-0-9]{32}$/)
            },
            {
              is: Joi.any().valid(TRANSPORTER.sparkpost).required(),
              then: Joi.string().regex(/^[a-z-0-9]{40}$/)
            },
            {
              is: Joi.any().valid(TRANSPORTER.sendinblue).required(),
              then: Joi.string().regex(/^xkeysib-[a-z-0-9]{64}-[a-z-A-Z-0-9]{16}$/)
            },
            {
              is: Joi.any().valid(TRANSPORTER.sendgrid).required(),
              then: Joi.string().regex(/^[a-z-A-Z-0-9\\-\\.\\_]{69}$/)
            },
            {
              is: Joi.any().valid(TRANSPORTER.postmark).required(),
              then: Joi.string().regex(/^[a-z-0-9]{8}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{12}$/)
            }
          ]
        }).required(),
        token: Joi.string().when('...name', {
          switch: [
            {
              is: Joi.any().valid(TRANSPORTER.mailjet).required(),
              then: Joi.string().regex(/^[a-z-0-9]{32}$/).required()
            }
          ]
        }).optional(),
      }).required(),
      templates: Joi.object().pattern( Joi.string(), Joi.when('name', {
        switch: [
          {
            is: Joi.any().valid(TRANSPORTER.mailgun).required(),
            then: Joi.string()
          },
          {
            is: Joi.any().valid(TRANSPORTER.mailjet).required(),
            then: Joi.string().regex(/^[0-9]{8}$/)
          },
          {
            is: Joi.any().valid(TRANSPORTER.sparkpost).required(),
            then: Joi.string()
          },
          {
            is: Joi.any().valid(TRANSPORTER.sendinblue).required(),
            then: Joi.number()
          },
          {
            is: Joi.any().valid(TRANSPORTER.sendgrid).required(),
            then: Joi.string().regex(/^d-[a-z0-9]{32}$/)
          },
          {
            is: Joi.any().valid(TRANSPORTER.postmark).required(),
            then: Joi.string()
          }
        ]
      }) )
    }),
    smtp: smtpSchema()
  }).xor('api', 'smtp').required()
});

export { configurationSchema }
