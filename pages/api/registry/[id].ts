import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { deleteRegistry, selectRegistryById } from '../../../utils/database';
import { response400, response404, response500 } from '../../../utils/Api';

import { ApiResult } from '../../../interfaces/api';
import { Registry } from '../../../interfaces';
import { getRegistyUrl } from '../../../utils/dockerRegistry';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) return response400(res);

    const registryId = parseInt(id, 10);
    const registry = await selectRegistryById(registryId);

    if (!registry) return response404(res);

    const result: ApiResult<Registry> = {
      status: 200,
      message: 'success',
      data: {
        ...registry,
        checkedDate: new Date().toString(),
        status: false,
      },
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
      result.data.status = true;
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
    await deleteRegistry(registryId);

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
