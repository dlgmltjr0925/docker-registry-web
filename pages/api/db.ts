import { NextApiRequest, NextApiResponse } from 'next';

import { getRegistries } from '../../utils/database';

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('called /api/db');
    const registries = await getRegistries();
    res.status(200).json(registries);
  } catch (error) {
    throw error;
  }
};

export default handler;
