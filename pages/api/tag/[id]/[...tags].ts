import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { response400, response404, response500 } from '../../../../utils/Api';

import { getRegistyUrl } from '../../../../utils/dockerRegistry';
import { promiseAll } from '../../../../utils/async';
import { selectRegistryById } from '../../../../utils/localStorage';

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, tags } = req.query;

    if (Array.isArray(id)) return response400(res);
    const registryId = parseInt(id, 10);

    const registry = await selectRegistryById(registryId);

    if (!registry) return response404(res);
    const { url, token } = registry;

    if (typeof tags === 'string') return response400(res);

    const tag = tags.pop();
    const name = tags.join('/');

    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/vnd.docker.distribution.manifest.v2+json',
      },
    };
    if (token) config.headers['Authorization'] = `Basic ${token}`;

    let registryUrl = getRegistyUrl(url, `/${name}/manifests/${tag}`);
    let response = await axios.get(registryUrl, config);

    if (!response || response.status !== 200) throw new Error();
    const { headers, data } = response;
    await promiseAll(
      data.layers.map(async ({ digest }: { digest: string }) => {
        try {
          const registryUrl = getRegistyUrl(url, `/${name}/blobs/${digest}`);
          return await axios.delete(registryUrl, config);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const digest = headers['docker-content-digest'];
    try {
      registryUrl = getRegistyUrl(url, `/${name}/blobs/${digest}`);
      await axios.delete(registryUrl, config);
    } catch (error) {
      console.log(error);
    }

    try {
      registryUrl = getRegistyUrl(url, `/${name}/manifests/${digest}`);
      await axios.delete(registryUrl, config);
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({});
  } catch (error) {
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
