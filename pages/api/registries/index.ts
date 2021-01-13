import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { getRegistyUrl, response400 } from '../../../utils/api';

import { ApiResult } from '../../../interfaces/api';
import { Registry } from '../../../interfaces';
import { promiseAll } from '../../../utils/async';
import { selectRegistries } from '../../../utils/database';

const get = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const rows = await selectRegistries();

    const checkedDate = new Date().toString();

    const registries = (await promiseAll(
      rows.map(async (registry) => {
        const { url, token } = registry;
        try {
          const registryUrl = getRegistyUrl(url, '/_catalog');
          const config: AxiosRequestConfig = { headers: {} };
          if (token) config.headers['Authorization'] = `Basic ${token}`;

          const res = await axios.get<{ repositories: string[] }>(
            registryUrl,
            config
          );

          if (res && res.data) {
            const { repositories } = res.data;
            const images = repositories.map((name: string) => ({
              name,
            }));
            return {
              ...registry,
              images,
              checkedDate,
              status: true,
            };
          }
        } catch (error) {
          return {
            ...registry,
            checkedDate,
            status: false,
          };
        }
      })
    )) as Registry[];

    const result: ApiResult<{ registries: Registry[] }> = {
      status: 200,
      message: 'success',
      data: { registries },
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
        response400(res);
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
