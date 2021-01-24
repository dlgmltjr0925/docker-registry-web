import Api, { getRegistyUrl } from '../../../utils/api';
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

import { Registry } from '../../../interfaces';
import { Status } from '../../../utils/ApiError';
import { getRegistries } from '../../../utils/database';
import { promiseAll } from '../../../utils/async';

class RegistryApi extends Api {
  async get(_: NextApiRequest, res: NextApiResponse) {
    try {
      const rows = await getRegistries();

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
            console.error(error);
            return {
              ...registry,
              checkedDate,
              status: false,
            };
          }
        })
      )) as Registry[];

      res.status(Status.OK).json({
        registries,
      });
    } catch (error) {
      throw error;
    }
  }
}

const registryApi = new RegistryApi();

export default registryApi.handler;
