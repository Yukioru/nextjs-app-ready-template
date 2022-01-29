import { NextApiRequest } from 'next';

function getBody(
  req: NextApiRequest,
  fields?: string[]
): NextApiRequest['body'] {
  const data: NextApiRequest['body'] = req.body || {};
  if (typeof data !== 'object') throw { message: 'body-type' };

  if (fields && Array.isArray(fields)) {
    const failedFields: string[] = [];
    fields.forEach((field) => {
      if (!data.hasOwnProperty(field) || !data[field]) {
        failedFields.push(field);
      } else if (data[field] && data[field].length === 0) {
        failedFields.push(field);
      }
    });
    if (failedFields.length > 0) {
      throw {
        message: 'fields-required',
        opts: {
          fields: failedFields,
        },
      };
    }
  }

  return data;
}

export default getBody;
