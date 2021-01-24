import axios, { AxiosRequestConfig } from 'axios';

import { config } from '@fortawesome/fontawesome-svg-core';

export const getRegistyUrl = (url: string, path: string = '/') => {
  return `https://${url}/v2${path}`;
};

/**
 * GetBaseArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 */
interface GetBaseArgs {
  host: string;
  authorization?: string;
}

/**
 * GET /v2/
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const getBase = async ({ host, authorization }: GetBaseArgs) => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs['headers'] = { Authorization: authorization };
    const url = getRegistyUrl(host, '/');
    const res = await axios.get(url, configs);
    console.log(res);
  } catch (error) {
    throw error;
  }
};
