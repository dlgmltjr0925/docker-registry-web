import { Image, Registry } from '../../../interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import {
  deleteRegistry,
  selectRegistryById,
} from '../../../utils/localStorage';
import { response400, response404, response500 } from '../../../utils/Api';

import { ApiResult } from '../../../interfaces/api';
import { getRegistyUrl } from '../../../utils/dockerRegistry';
import { promiseAll } from '../../../utils/async';

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
        tags: [],
      }));
      result.data.status = true;
    }

    if (result.data.images && result.data.images.length > 0) {
      await promiseAll(
        result.data.images.map(
          async ({ name }: Image, index: number): Promise<void> => {
            try {
              const tagsUrl = getRegistyUrl(url, `/${name}/tags/list`);
              const res = await axios.get(tagsUrl, config);
              if (res && res.data) {
                const tags =
                  res.data.tags === null
                    ? []
                    : res.data.tags.map((tag: string) => ({ name: tag }));
                (result.data.images as Image[])[index].tags = tags;
              }
            } catch (error) {
              console.log(error);
            }
          }
        )
      );
      result.data.images = result.data.images.filter(
        ({ tags }) => tags && tags.length > 0
      );
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
