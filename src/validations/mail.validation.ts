import * as Joi from 'joi';

import { COMPILER } from '@enums/compiler.enum';
import { ATTACHMENT_MIME_TYPE } from '@enums/attachment-mime-type.enum';
import { ATTACHMENT_DISPOSITION } from '@enums/attachment-disposition.enum';
import { BUFFER_MIME_TYPE } from '@enums/buffer-mime-type.enum';

import { recipient } from '@schemas/recipient.schema';

import { list } from '@utils/enum.util';

const addresses = () => {
	return Joi.alternatives().try(
			recipient().required(),
			Joi.array().items( recipient() ).required()
		)
};

const mailSchema = Joi.object({
  compiler: Joi.any().valid(...list(COMPILER)),
  meta: Joi.object({
    subject: Joi.string().max(128).required(),
    from: recipient(),
    replyTo: recipient(),
    to: addresses().required(),
    cc: addresses(),
    bcc: addresses(),
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
