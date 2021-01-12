import { NextApiRequest, NextApiResponse } from 'next';

import { initialize } from '../../utils/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('called /api/db');
    initialize();
  } catch (error) {
    throw error;
  }
};

export default handler;
