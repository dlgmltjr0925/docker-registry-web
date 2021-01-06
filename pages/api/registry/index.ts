import { NextApiRequest, NextApiResponse } from 'next';

import { Registry } from '../../../interfaces';
import axios from 'axios';
import fs from 'fs';
import getConfig from 'next/config';
import path from 'path';

interface Data {
  lastId: number;
  list: Registry[];
}

const { serverRuntimeConfig } = getConfig();

const REGISTRY_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/registry.json'
);

const data: Data = {
  lastId: -1,
  list: [],
};

const getRegisty = (): Data => {
  try {
    if (data.lastId === -1) {
      if (!fs.existsSync(REGISTRY_FILE_PATH)) {
        fs.writeFileSync(
          REGISTRY_FILE_PATH,
          JSON.stringify({ lastId: 0, list: [] })
        );
      }

      const registry = fs.readFileSync(REGISTRY_FILE_PATH, 'utf8');
      const { lastId, list } = JSON.parse(registry) as Data;
      data.lastId = lastId;
      data.list = list;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const get = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = getRegisty();

    res.status(200).json(data.list);
  } catch (error) {
    throw error;
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = getRegisty();

  const { name, host, port } = req.body;

  const { authorization } = req.headers;

  try {
    let registryUrl = `https://${host}`;
    if (port) registryUrl += `:${port}`;
    registryUrl += '/v2/';

    console.log('registry url : ', registryUrl);

    const headers: { authorization?: string } = {};

    if (authorization) headers.authorization = authorization;

    const result = await axios.get(registryUrl, {
      headers,
    });

    if (result && result.status === 200) {
      const registry: Registry = { id: ++data.lastId, name, host };
      if (port) registry.port = port;
      if (authorization) registry.token = authorization.split(' ')[1];

      data.list.push(registry);

      fs.writeFileSync(
        REGISTRY_FILE_PATH,
        JSON.stringify(data, null, 2),
        'utf8'
      );

      res.status(200).send({ data: 'success' });
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        res.setHeader('www-authenticate', 'Basic realm="Registry Realm"');
        return res.status(401).json({});
      }
    } else if (error.errno === -3008) {
      return res.status(400).json({
        message: 'Invalid hostname',
      });
    }
    throw error;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        await get(req, res);
        break;
      case 'POST':
        await post(req, res);
        break;
      default:
        res.status(404).end();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
