import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import {
  getRegistyUrl,
  response400,
  response404,
  response500,
} from '../../../../utils/api';

import { ApiResult } from '../../../../interfaces/api';
import { promiseAll } from '../../../../utils/async';
import { selectRegistryById } from '../../../../utils/database';

interface ImageTags {
  name: string;
  tags: string[];
}
const del = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/vnd.docker.distribution.manifest.v2+json',
      },
    };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    const response = await axios.get<ImageTags>(registryUrl, config);

    const result: ApiResult<string[]> = {
      status: 200,
      message: 'success',
      data: [],
    };

    if (response && response.data) {
      const { tags } = response.data;
      await promiseAll(
        tags.map(async (tag) => {
          try {
            let registryUrl = getRegistyUrl(url, `/${name}/manifests/${tag}`);
            let response = await axios.get(registryUrl, config);

            if (response && response.headers) {
              const digest = response.headers['docker-content-digest'] as
                | string
                | undefined;

              if (!digest) return;

              registryUrl = getRegistyUrl(url, `/${name}/manifests/${digest}`);
              response = await axios.delete(registryUrl, config);

              if (response && response.status === 202) {
                result.data.push(tag);
              }
            }

            return null;
          } catch (error) {
            throw error;
          }
        })
      );
    }

    res.status(200).json(result);
  } catch (error) {
    if (typeof error === 'object' && error.response) {
      const { status, statusText } = error.response;
      if (status === 405) {
        return res.status(200).json({
          status: 405,
          message: statusText,
          data: {},
        });
      }
    }
    throw error;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
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
