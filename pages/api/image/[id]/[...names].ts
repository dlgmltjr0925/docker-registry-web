import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  deleteImageByIdAndName,
  insertImageByIdAndName,
  selectImageByIdAndName,
  selectRegistryById,
  updateImageByIdAndName,
} from '../../../../utils/database';
import { response400, response404, response500 } from '../../../../utils/Api';

import { ApiResult } from '../../../../interfaces/api';
import { Image } from '../../../../interfaces';
import { getRegistyUrl } from '../../../../utils/dockerRegistry';
import { promiseAll } from '../../../../utils/async';

interface ImageTags {
  name: string;
  tags: string[];
}

interface Query extends Record<string, string | string[]> {
  id: string;
  names: string[];
}

interface PutBody {
  repositoryUrl: string;
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, names } = req.query as Query;

    const registryId = parseInt(id, 10);
    const name = names.join('/');

    const registry = await selectRegistryById(registryId);

    if (!registry) return response404(res);

    const { url, token } = registry;

    let registryUrl = getRegistyUrl(url, '/_catalog');
    const config: AxiosRequestConfig = { headers: {} };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    const promise1 = axios.get(registryUrl, config);

    const promise2 = selectImageByIdAndName({ registryId, name });

    let [response, image] = (await promiseAll([promise1, promise2])) as [
      AxiosResponse<{ repositories: string[] }>,
      Image | null
    ];

    if (!response || !response.data || !response.data.repositories)
      return response400(res);

    const { repositories: images } = response.data;

    if (!images.includes(name)) {
      deleteImageByIdAndName({ registryId, name });
      return response404(res);
    } else if (image === null) {
      image = await insertImageByIdAndName({ registryId, name });
    }

    res.status(200).json({
      status: 200,
      message: 'success',
      data: image,
    });
  } catch (error) {
    throw error;
  }
};

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, names } = req.query as Query;
    const { repositoryUrl } = req.body as PutBody;

    if (repositoryUrl === undefined) return response400(res);

    const registryId = parseInt(id, 10);
    const name = names.join('/');

    const image = await updateImageByIdAndName({
      registryId,
      name,
      repositoryUrl,
    });

    res.status(200).json({
      status: 200,
      message: 'success',
      data: image,
    });
  } catch (error) {
    throw error;
  }
};

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, names } = req.query as Query;

    const registryId = parseInt(id, 10);
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
      case 'GET':
        await get(req, res);
        break;
      case 'PUT':
        await put(req, res);
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
