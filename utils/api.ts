import { ApiResult } from '../interfaces/api';
import { NextApiResponse } from 'next';
import { Registry } from '../interfaces';
import fs from 'fs';
import getConfig from 'next/config';
import path from 'path';

interface RegistryData {
  lastId: number;
  list: Registry[];
}

const { serverRuntimeConfig } = getConfig();

export const REGISTRY_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/registry.json'
);

const registryData: RegistryData = {
  lastId: -1,
  list: [],
};

export const getRegistyUrl = (url: string, detail: string = '/') => {
  return `https://${url}/v2${detail}`;
};

export const getRegistries = async (): Promise<RegistryData> => {
  try {
    if (registryData.lastId === -1) {
      if (!fs.existsSync(REGISTRY_FILE_PATH)) {
        fs.writeFileSync(
          REGISTRY_FILE_PATH,
          JSON.stringify({ lastId: 0, list: [] })
        );
      }

      const registry = fs.readFileSync(REGISTRY_FILE_PATH, 'utf8');
      const { lastId, list } = JSON.parse(registry) as RegistryData;
      registryData.lastId = lastId;
      registryData.list = list;
    }
    return registryData;
  } catch (error) {
    throw error;
  }
};

export const response404 = (res: NextApiResponse) => {
  const result: ApiResult = {
    status: 404,
    message: 'Not Found',
    data: {},
  };
  res.status(200).json(result);
};

export const response500 = (res: NextApiResponse) => {
  const result: ApiResult = {
    status: 500,
    message: 'Internal Server Error',
    data: {},
  };
  res.status(200).json(result);
};
