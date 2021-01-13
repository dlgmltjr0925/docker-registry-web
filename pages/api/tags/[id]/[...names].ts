import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import {
  getRegistyUrl,
  response400,
  response404,
  response500,
} from '../../../../utils/api';

import { ApiResult } from '../../../../interfaces/api';
import { selectRegistryById } from '../../../../utils/database';

interface ImageTags {
  name: string;
  tags: string[];
}
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, names } = req.query;

    if (Array.isArray(id)) return response400(res);
    const registryId = parseInt(id, 10);

    if (typeof names === 'string') return response400(res);
    const name = names.join('/');

    const registry = await selectRegistryById(registryId);

    if (!registry) return response404(res);
    const { url, token } = registry;

    const registryUrl = getRegistyUrl(url, `/${name}/tags/list`);
    const config: AxiosRequestConfig = { headers: {} };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    const axiosResponse = await axios.get<ImageTags>(registryUrl, config);

    const result: ApiResult<string[]> = {
      status: 200,
      message: 'success',
      data: [],
    };

    if (axiosResponse && axiosResponse.data) {
      result.data = axiosResponse.data.tags;
    }

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
      default:
        response404(res);
        break;
    }
  } catch (error) {
    response500(res);
  }
};

export default handler;
