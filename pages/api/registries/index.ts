import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { getRegistries, getRegistyUrl } from '../../../utils/api';

import { ApiResult } from '../../../interfaces/api';
import { Registry } from '../../../interfaces';
import { promiseAll } from '../../../utils/async';

const get = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getRegistries();

    await promiseAll(
      data.list.map(async ({ url, token }, index) => {
        try {
          const registryUrl = getRegistyUrl(url, '/_catalog');
          const config: AxiosRequestConfig = { headers: {} };
          if (token) config.headers['Authorization'] = `Basic ${token}`;

          const res = await axios.get(registryUrl, config);

          if (res && res.data) {
            const { repositories } = res.data;
            data.list[index].images = repositories.map((name: string) => ({
              name,
            }));
          }
        } catch (error) {
          console.log(error);
        }
      })
    );

    const result: ApiResult<{ registries: Registry[] }> = {
      status: 200,
      message: 'success',
      data: { registries: data.list },
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
      default:
        const result: ApiResult = {
          status: 404,
          message: 'Not Found',
          data: {},
        };
        res.status(200).json(result);
        break;
    }
  } catch (error) {
    const result: ApiResult = {
      status: 500,
      message: 'Internal Server Error',
      data: {},
    };
    res.status(200).json(result);
  }
};

export default handler;
