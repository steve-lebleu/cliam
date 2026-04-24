import { createHash, createHmac } from 'node:crypto';

const SERVICE = 'ses';
const ALGORITHM = 'AWS4-HMAC-SHA256';

function sha256(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

function hmac(key: Uint8Array | string, data: string): Uint8Array {
  return new Uint8Array(createHmac('sha256', key).update(data, 'utf8').digest());
}

export function signRequest(params: {
  method: string;
  region: string;
  path: string;
  body: string;
  accessKeyId: string;
  secretAccessKey: string;
}): Record<string, string> {
  const { method, region, path, body, accessKeyId, secretAccessKey } = params;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
  const dateShort = amzDate.slice(0, 8);
  const host = `email.${region}.amazonaws.com`;
  const payloadHash = sha256(body);

  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [method, path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');

  const credentialScope = `${dateShort}/${region}/${SERVICE}/aws4_request`;

  const stringToSign = [ALGORITHM, amzDate, credentialScope, sha256(canonicalRequest)].join('\n');

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateShort), region), SERVICE),
    'aws4_request',
  );

  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return {
    'Authorization': `${ALGORITHM} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Content-Sha256': payloadHash,
  };
}
