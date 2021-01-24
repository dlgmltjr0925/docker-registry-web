import ApiError, { Status } from './ApiError';
import { NextApiRequest, NextApiResponse } from 'next';

import { ApiResult } from '../interfaces/api';
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

export default class Api {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.handler = this.handler.bind(this);
  }

  async get(req: NextApiRequest, res: NextApiResponse) {
    console.log('GET', req, res);
    throw ApiError.ERROR_404;
  }

  async post(req: NextApiRequest, res: NextApiResponse) {
    console.log('POST', req, res);
    throw ApiError.ERROR_404;
  }

  async put(req: NextApiRequest, res: NextApiResponse) {
    console.log('PUT', req, res);
    throw ApiError.ERROR_404;
  }

  async delete(req: NextApiRequest, res: NextApiResponse) {
    console.log('DELTEE', req, res);
    throw ApiError.ERROR_404;
  }

  async handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      switch (req.method) {
        case 'GET':
          await this.get(req, res);
          break;
        case 'POST':
          await this.post(req, res);
          break;
        case 'PUT':
          await this.put(req, res);
          break;
        case 'DELETE':
          await this.delete(req, res);
          break;
        default:
          throw ApiError.ERROR_404;
      }
    } catch (error) {
      console.error(error);
      const { status, message } = error;
      if (status && message) {
        return res.status(status).json({ message });
      } else {
        return res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error' });
      }
    }
  }
}
