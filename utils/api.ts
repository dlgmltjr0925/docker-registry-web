import { ApiResult } from '../interfaces/api';
import { NextApiResponse } from 'next';
import getConfig from 'next/config';
import path from 'path';

const { serverRuntimeConfig } = getConfig();

export const REGISTRY_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/registry.json'
);

export const getRegistyUrl = (url: string, detail: string = '/') => {
  return `https://${url}/v2${detail}`;
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
