import * as Joi from 'joi';

import { RENDER_ENGINE } from '../types/enums/render-engine.enum';
import { ATTACHMENT_MIME_TYPE } from '../types/enums/attachment-mime-type.enum';
import { ATTACHMENT_DISPOSITION } from '../types/enums/attachment-disposition.enum';
import { BUFFER_MIME_TYPE } from '../types/enums/buffer-mime-type.enum';

import { recipient } from '../types/schemas/recipient.schema';

import { list } from '../utils/enum.util';

const mailSchema = Joi.object({
  renderEngine: Joi.any().valid(...list(RENDER_ENGINE)),
  transporter: Joi.string().required(),
  meta: Joi.object({
    subject: Joi.string().max(128).required(),
    from: recipient(),
    replyTo: recipient(),
    to: Joi.array().items( recipient() ).required(),
    cc: Joi.array().items( recipient() ),
    bcc: Joi.array().items( recipient() ),
    attachments: Joi.array().items(
      Joi.object({
        content: Joi.alternatives([ Joi.string().base64(), Joi.string().regex(/^data:[a-zA-Z-\/]{1,48};base64,.*$/) ]).required(),
        type: Joi.any().valid(...list(ATTACHMENT_MIME_TYPE)),
        filename: Joi.string().regex(/[a-z-A-Z-0-9]{2,}\.[a-z]{3,4}/).required(), /** @todo LOW :: attachment.filename extension should also match attachment.type */
        disposition: Joi.any().valid(...list(ATTACHMENT_DISPOSITION)).default( ATTACHMENT_DISPOSITION.attachment )
      })
    )
  }).required(),
  content: Joi.array().items(
    Joi.object({
      type: Joi.any().valid(BUFFER_MIME_TYPE['text/html']).required(),
      value: Joi.string().required()
    }).required(),
    Joi.object({
      type: Joi.any().valid(...list(BUFFER_MIME_TYPE)).required(),
      value: Joi.string().required()
    })
  ).max(2),
  data: Joi.object()
}).xor('content', 'data').required();

export { mailSchema };
