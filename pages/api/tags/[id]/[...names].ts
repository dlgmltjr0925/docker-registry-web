import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { response400, response404, response500 } from '../../../../utils/Api';

import { ApiResult } from '../../../../interfaces/api';
import { Tag } from '../../../../interfaces';
import { getRegistyUrl } from '../../../../utils/dockerRegistry';
import { promiseAll } from '../../../../utils/async';
import { selectRegistryById } from '../../../../utils/localStorage';

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
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/vnd.docker.distribution.manifest.v2+json',
      },
    };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    const axiosResponse = await axios.get<ImageTags>(registryUrl, config);

    const result: ApiResult<Tag[]> = {
      status: 200,
      message: 'success',
      data: [],
    };

    if (axiosResponse && axiosResponse.data) {
      result.data = (await promiseAll(
        axiosResponse.data.tags.map(async (tag) => {
          try {
            const _tag: Tag = { name: tag };
            const registryUrl = getRegistyUrl(url, `/${name}/manifests/${tag}`);
            const res = await axios.get(registryUrl, config);
            if (res) {
              const { status, headers, data } = res;
              if (status === 200) {
                _tag.digest = headers['docker-content-digest'];
                _tag.layers = data.layers;
              }
            }
            return _tag;
          } catch (error) {
            throw error;
          }
        })
      )) as Tag[];
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
