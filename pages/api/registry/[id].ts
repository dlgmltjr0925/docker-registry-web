import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import {
  getRegistries,
  getRegistyUrl,
  removeRegistry,
  response400,
  response404,
  response500,
} from '../../../utils/api';

import { ApiResult } from '../../../interfaces/api';
import { Registry } from '../../../interfaces';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) return response400(res);

    const registryId = parseInt(id, 10);
    const data = await getRegistries();
    const registry = data.list.find(({ id }) => registryId === id);

    if (!registry) return response404(res);

    const result: ApiResult<Registry> = {
      status: 200,
      message: 'sucess',
      data: { ...registry },
    };

    const { url, token } = registry;
    const registryUrl = getRegistyUrl(url, '/_catalog');
    const config: AxiosRequestConfig = { headers: {} };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    const axiosResponse = await axios.get(registryUrl, config);

    if (axiosResponse && axiosResponse.data) {
      const { repositories } = axiosResponse.data;
      result.data.images = repositories.map((name: string) => ({
        name,
      }));
    }

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) return response400(res);

    const registryId = parseInt(id, 10);
    await removeRegistry(registryId);

    const result: ApiResult = {
      status: 200,
      message: 'success',
      data: {},
    };

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        await get(req, res);
        break;
      case 'DELETE':
        await del(req, res);
        break;
      default:
        response404(res);
        break;
    }
  } catch (error) {
    response500(res);
  }
};

export default handler;
