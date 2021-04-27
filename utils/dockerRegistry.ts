import DockerRegistryError, { ErrorCode } from "./DockerRegistryError";
import axios, { AxiosRequestConfig } from "axios";

import ApiError from "./ApiError";

export const getRegistyUrl = (url: string, path: string = "/") => {
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
    if (!errors) return ApiError.BadRequest;
    for (let { code } of errors) {
      switch (code) {
        case "NAME_INVALID":
          return DockerRegistryError.NameInvalid;
        case "TAG_INVALID":
          return DockerRegistryError.TagInvalid;
        case "DIGEST_INVALID":
          return DockerRegistryError.DigestInvalid;
        case "MANIFEST_INVALID":
          return DockerRegistryError.ManifestInvalid;
        case "MANIFEST_UNVERIFIED":
          return DockerRegistryError.ManifestUnverified;
        case "BLOB_UNKNOWN":
          return DockerRegistryError.BlobUnkown;
        case "BLOB_UPLOAD_INVALID":
          return DockerRegistryError.BlobUploadInvalid;
        case "UNSUPPORTED":
          return DockerRegistryError.Unsupported;
      }
    }
  } else if (/401/.test(error.message)) {
    if (!errors) return ApiError.Unauthorized;
    for (let { code } of errors) {
      switch (code) {
        case "UNAUTHORIZED":
          return DockerRegistryError.Unauthorized;
      }
    }
  } else if (/403/.test(error.message)) {
    if (!errors) return ApiError.Forbidden;
    for (let { code } of errors) {
      switch (code) {
        case "DENIED":
          return DockerRegistryError.Denied;
      }
    }
  } else if (/404|ENOTFOUND/.test(error.message)) {
    if (!errors) return ApiError.NotFound;
    for (let { code } of errors) {
      switch (code) {
        case "NAME_UNKNOWN":
          return DockerRegistryError.NameUnknown;
        case "MANIFEST_UNKNOWN":
          return DockerRegistryError.ManifestUnknown;
        case "BLOB_UNKNOWN":
          return DockerRegistryError.BlobUnkown;
      }
    }
  } else if (/429/.test(error.message)) {
    return ApiError.TooManyRequests;
  }
  return ApiError.InternalServerError;
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
    const url = getRegistyUrl(host, "/");
    const res = await axios.get<{}>(url, configs);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * GetImagesArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * n - Limit the number of entries in each response. It not present, all entries will be returned
 * last - Result set will include values lexically after last
 */
export interface GetImagesArgs extends GetBaseArgs {
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
}: GetImagesArgs): Promise<string[]> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    let path = "/_catalog";
    if (n) path += `?n=${n}`;
    if (n && last !== undefined) path += `&last=${last}`;
    if (n) path += '; rel="next"';
    const url = getRegistyUrl(host, path);
    const res = await axios.get<{ repositories: string[] }>(url, configs);
    return res.data.repositories;
  } catch (error) {
    throw handleError(error);
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
}: GetTagsArgs): Promise<GetTagsResponse> => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/tags/list`);
    const res = await axios.get<GetTagsResponse>(url, configs);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * GetManifestsArgs
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
  mediaType: "application/vnd.docker.image.rootfs.diff.tar.gzip";
  size: number;
  digest: string;
}
interface DistributionManifest {
  schemaVersion: 2;
  mediaType: "application/vnd.docker.distribution.manifest.v2+json";
  config: {
    mediaType: "application/vnd.docker.container.image.v1+json";
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
      "application/vnd.docker.distribution.manifest.v2+json";
    const res2 = await axios.get<DistributionManifest>(url, configs);
    const digest = res2.headers["docker-content-digest"] as string;
    return { ...res1.data, digest };
  } catch (error) {
    throw handleError(error);
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
    throw handleError(error);
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
    throw handleError(error);
  }
};

/**
 * DeleteBlobArgs
 * host - docker registry hostname
 * authorization - <scheme> <token> ex) Basic ZG9ja2VyOnJlZ2lzdHJ5
 * name - Name of the target repository.
 * digest - Digest of desired blob.
 */
interface DeleteBlobArgs extends GetBaseArgs {
  name: string;
  digest: string;
}

/**
 * DELETE /v2/<name>/blobs/<digest>
 * Host: <registry host>
 * Authorization: <scheme> <token>
 */
export const deleteBlobs = async ({
  host,
  authorization,
  name,
  digest,
}: DeleteBlobArgs) => {
  try {
    const configs: AxiosRequestConfig = {};
    if (authorization) configs.headers = { Authorization: authorization };
    const url = getRegistyUrl(host, `/${name}/blobs/${digest}`);
    const res = await axios.delete<string>(url, configs);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};
