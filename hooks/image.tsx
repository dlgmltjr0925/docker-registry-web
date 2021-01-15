import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiResult } from '../interfaces/api';
import { useState } from 'react';

interface SetRepository {
  url?: string;
}

interface UseSetImageProps {
  registryId: number;
  name: string;
}

export const useSetImage = ({ registryId, name }: UseSetImageProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const setRepository = async ({
    url,
  }: SetRepository): Promise<AxiosResponse<ApiResult> | void> => {
    try {
      if (isUploading) return;
      setIsUploading(true);

      const body: Record<string, string> = {};
      if (url) body.url = url;

      return await axios.put(`/api/image/${registryId}/${name}`, body);
    } catch (error) {
      setIsUploading(false);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    setRepository,
  };
};
