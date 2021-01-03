import { NextApiRequest, NextApiResponse } from 'next';

import { registries } from './__mock__/registries';

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json(registries);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
