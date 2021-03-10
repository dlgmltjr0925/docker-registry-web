import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

import Api from '../../../utils/Api';
import { Registry } from '../../../interfaces';
import { Status } from '../../../utils/ApiError';
import { getRegistries } from '../../../utils/localStorage';
import { getRegistyUrl } from '../../../utils/dockerRegistry';
import { promiseAll } from '../../../utils/async';

class RegistryApi extends Api {
  async get(_: NextApiRequest, res: NextApiResponse) {
    try {
      const results = await getRegistries();

      const registries = (await promiseAll(
        results.map(async (registry) => {
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
                checkedDate: new Date().toString(),
                status: true,
              };
            }
          } catch (error) {
            console.error(error);
            return {
              ...registry,
              checkedDate: new Date().toString(),
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
