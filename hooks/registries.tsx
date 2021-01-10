import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiResult } from '../interfaces/api';
import { useState } from 'react';

interface AddRegistryArgs {
  name: string;
  url: string;
  hasAuth: boolean;
  username: string;
  password: string;
}

export const useAddRegistry = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const addRegisty = async ({
    name,
    url,
    hasAuth,
    username,
    password,
  }: AddRegistryArgs): Promise<AxiosResponse<ApiResult> | void> => {
    try {
      if (isUploading) return;
      setIsUploading(true);

      const config: AxiosRequestConfig = { headers: {} };
      if (hasAuth) {
        const token = btoa(`${username}:${password}`);
        config.headers['Authorization'] = `Basic ${token}`;
      }

      return await axios.post('/api/registry', { name, url }, config);
    } catch (error) {
      setIsUploading(false);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    addRegisty,
  };
};
