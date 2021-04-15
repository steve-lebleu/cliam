"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationSchema = void 0;
const Joi = require("joi");
const smtp_schema_1 = require("../types/schemas/smtp.schema");
const enum_util_1 = require("../utils/enum.util");
const transporter_enum_1 = require("../types/enums/transporter.enum");
const social_network_enum_1 = require("../types/enums/social-network.enum");
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
        socials: Joi.array().items(Joi.object({
            name: Joi.any().valid(...enum_util_1.list(social_network_enum_1.SOCIAL_NETWORK)).required(),
            url: Joi.string().uri().required()
        })),
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
            name: Joi.any().valid(...enum_util_1.list(transporter_enum_1.TRANSPORTER)).required(),
            credentials: Joi.object({
                apiKey: Joi.string().when('...name', {
                    switch: [
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailgun).required(),
                            then: Joi.string().regex(/^key-[a-z-0-9]{32}$/)
                        },
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailjet).required(),
                            then: Joi.string().regex(/^[a-z-0-9]{32}$/)
                        },
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sparkpost).required(),
                            then: Joi.string().regex(/^[a-z-0-9]{40}$/)
                        },
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendinblue).required(),
                            then: Joi.string().regex(/^xkeysib-[a-z-0-9]{64}-[a-z-A-Z-0-9]{16}$/)
                        },
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendgrid).required(),
                            then: Joi.string().regex(/^[a-z-A-Z-0-9\\-\\.\\_]{69}$/)
                        },
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.postmark).required(),
                            then: Joi.string().regex(/^[a-z-0-9]{8}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{12}$/)
                        }
                    ]
                }).required(),
                token: Joi.string().when('...name', {
                    switch: [
                        {
                            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailjet).required(),
                            then: Joi.string().regex(/^[a-z-0-9]{32}$/).required()
                        }
                    ]
                }).optional(),
            }).required(),
            templates: Joi.object().pattern(Joi.string(), Joi.when('name', {
                switch: [
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailgun).required(),
                        then: Joi.string()
                    },
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailjet).required(),
                        then: Joi.string().regex(/^[0-9]{8}$/)
                    },
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sparkpost).required(),
                        then: Joi.string()
                    },
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendinblue).required(),
                        then: Joi.number()
                    },
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendgrid).required(),
                        then: Joi.string().regex(/^d-[a-z0-9]{32}$/)
                    },
                    {
                        is: Joi.any().valid(transporter_enum_1.TRANSPORTER.postmark).required(),
                        then: Joi.string()
                    }
                ]
            }))
        }),
        smtp: smtp_schema_1.smtp()
    }).xor('api', 'smtp').required()
});
exports.configurationSchema = configurationSchema;
