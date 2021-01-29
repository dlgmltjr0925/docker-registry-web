import DockerRegistryError, { ErrorCode } from './DockerRegistryError';
import axios, { AxiosRequestConfig } from 'axios';

import ApiError from './ApiError';

export const getRegistyUrl = (url: string, path: string = '/') => {
  return `https://${url}/v2${path}`;
};

interface Error {
  code: keyof typeof ErrorCode;
  message: string;
  detail: unknown;
}

type Errors = Error[] | undefined;

const handleError = (error: any) => {
  const errors: Errors = error.response?.data?.errors;

  if (/400/.test(error.message)) {
    if (!errors) throw ApiError.BadRequest;
    for (let { code } of errors) {
      switch (code) {
        case 'NAME_INVALID':
          throw DockerRegistryError.NameInvalid;
        case 'TAG_INVALID':
          throw DockerRegistryError.TagInvalid;
        case 'DIGEST_INVALID':
          throw DockerRegistryError.DigestInvalid;
        case 'MANIFEST_INVALID':
          throw DockerRegistryError.ManifestInvalid;
        case 'MANIFEST_UNVERIFIED':
          throw DockerRegistryError.ManifestUnverified;
        case 'BLOB_UNKNOWN':
          throw DockerRegistryError.BlobUnkown;
        case 'BLOB_UPLOAD_INVALID':
          throw DockerRegistryError.BlobUploadInvalid;
        case 'UNSUPPORTED':
          throw DockerRegistryError.Unsupported;
      }
    }
  } else if (/401/.test(error.message)) {
    if (!errors) throw ApiError.Unauthorized;
    for (let { code } of errors) {
      switch (code) {
        case 'UNAUTHORIZED':
          throw DockerRegistryError.Unauthorized;
      }
    }
  } else if (/403/.test(error.message)) {
    if (!errors) throw ApiError.Forbidden;
    for (let { code } of errors) {
      switch (code) {
        case 'DENIED':
          throw DockerRegistryError.Denied;
      }
    }
  } else if (/404|ENOTFOUND/.test(error.message)) {
    if (!errors) throw ApiError.NotFound;
    for (let { code } of errors) {
      switch (code) {
        case 'NAME_UNKNOWN':
          throw DockerRegistryError.NameUnknown;
        case 'MANIFEST_UNKNOWN':
          throw DockerRegistryError.ManifestUnknown;
        case 'BLOB_UNKNOWN':
          throw DockerRegistryError.BlobUnkown;
      }
    }
  } else if (/429/.test(error.message)) {
    throw ApiError.TooManyRequests;
  } else {
    throw ApiError.InternalServerError;
  }
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
export const getBase = async ({
  host,
  authorization,
}: GetBaseArgs): Promise<{} | undefined> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, '/');
    const res = await axios.get<{}>(url, configs);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * GetBaseArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * n - Limit the number of entries in each response. It not present, all entries will be returned
 * last - Result set will include values lexically after last
 */
interface GetImagesArgs extends GetBaseArgs {
  n?: number;
  last?: string;
}

/**
 * GET /v2/_catalog
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const getImages = async ({
  host,
  authorization,
  n,
  last,
}: GetImagesArgs): Promise<string[] | undefined> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    let path = '/_catalog';
    if (n) path += `?n=${n}`;
    if (n && last !== undefined) path += `&last=${last}`;
    if (n) path += '; rel="next"';
    const url = getRegistyUrl(host, path);
    const res = await axios.get<{ repositories: string[] }>(url, configs);
    return res.data.repositories;
  } catch (error) {
    handleError(error);
  }
};

/**
 * GetTagsArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * name - Name of the target repository
 */
interface GetTagsArgs extends GetBaseArgs {
  name: string;
}

/**
 * GetTagsResponse
 */
interface GetTagsResponse {
  name: string;
  tags: string[];
}

/**
 * GET /v2/<name>/tags/list
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const getTags = async ({
  host,
  authorization,
  name,
}: GetTagsArgs): Promise<GetTagsResponse | undefined> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/tags/list`);
    const res = await axios.get<GetTagsResponse>(url, configs);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * GetTagsArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * name - Name of the target repository
 * reference - Tag or digest of the target manifest
 */
interface GetManifestsArgs extends GetBaseArgs {
  name: string;
  reference: string;
}

interface FsLayer {
  blobSum: string;
}

interface History {
  v1Compatibility: string;
}

interface Signature {
  header: {
    jwk: {
      crv: string;
      kid: string;
      kty: string;
      x: string;
      y: string;
    };
    alg: string;
  };
  signature: string;
  protected: string;
}

interface Manifest {
  name: string;
  tag: string;
  fsLayers: FsLayer[];
  history: History[];
  signatures: Signature[];
}

interface Layer {
  mediaType: 'application/vnd.docker.image.rootfs.diff.tar.gzip';
  size: number;
  digest: string;
}
interface DistributionManifest {
  schemaVersion: 2;
  mediaType: 'application/vnd.docker.distribution.manifest.v2+json';
  config: {
    mediaType: 'application/vnd.docker.container.image.v1+json';
    size: number;
    digest: string;
  };
  layers: Layer[];
}

/**
 * GetTagsResponse
 */
export interface GetManifestsResponse extends Manifest {
  digest: string;
}

/**
 * GET /v2/<name>/manifests/<reference>
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const getManifests = async ({
  host,
  authorization,
  name,
  reference,
}: GetManifestsArgs): Promise<GetManifestsResponse | undefined> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/manifests/${reference}`);
    const res1 = await axios.get<Manifest>(url, configs);
    configs.headers.Accept =
      'application/vnd.docker.distribution.manifest.v2+json';
    const res2 = await axios.get<DistributionManifest>(url, configs);
    const digest = res2.headers['docker-content-digest'] as string;
    return { ...res1.data, digest };
  } catch (error) {
    handleError(error);
  }
};

/**
 * DeleteTagsArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * name - Name of the target repository
 * reference - Tag or digest of the target manifest
 */
type DeleteTagsArgs = GetManifestsArgs;

/**
 * DELETE /v2/<name>/manifests/<reference>
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const deleteManifests = async ({
  host,
  authorization,
  name,
  reference,
}: DeleteTagsArgs): Promise<{} | undefined> => {
  try {
    let digest = reference;
    if (!/^sha256/.test(digest)) {
      const res = await getManifests({ host, authorization, name, reference });
      if (res) digest = res.digest;
    }
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/manifests/${digest}`);
    const res = await axios.delete<{}>(url, configs);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * GetTagsArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * name - Name of the target repository
 * reference - Tag or digest of the target manifest
 */
interface GetBlobArgs extends GetBaseArgs {
  name: string;
  digest: string;
}

/**
 * GET /v2/<name>/blobs/<digest>
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const getBlobs = async ({
  host,
  authorization,
  name,
  digest,
}: GetBlobArgs) => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/blobs/${digest}`);
    const res = await axios.get<string>(url, configs);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
