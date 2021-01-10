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
        registryData.lastId = 0;
        fs.writeFileSync(
          REGISTRY_FILE_PATH,
          JSON.stringify(registryData, null, 2),
          'utf8'
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

export const addRegistry = async (
  registry: Omit<Registry, 'id'>
): Promise<Registry> => {
  try {
    const data = await getRegistries();
    data.lastId += 1;
    const newRegistry: Registry = {
      id: data.lastId,
      ...registry,
    };

    data.list.push(newRegistry);

    fs.writeFileSync(REGISTRY_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');

    return newRegistry;
  } catch (error) {
    throw error;
  }
};

export const removeRegistry = async (registryId: number): Promise<void> => {
  try {
    const data = await getRegistries();
    data.list = data.list.filter(({ id }) => registryId !== id);

    fs.writeFileSync(REGISTRY_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw error;
  }
};

export const response400 = (res: NextApiResponse) => {
  const result: ApiResult = {
    status: 400,
    message: 'Bad Request',
    data: {},
  };
  res.status(200).json(result);
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
