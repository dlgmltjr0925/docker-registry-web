import ApiError, { Status } from './ApiError';

export enum ErrorCode {
  BLOB_UNKNOWN = 1000,
  BLOB_UPLOAD_INVALID = 1001,
  BLOB_UPLOAD_UNKNOWN = 1002,
  DIGEST_INVALID = 1003,
  MANIFEST_BLOB_UNKNOWN = 1004,
  MANIFEST_INVALID = 1005,
  MANIFEST_UNKNOWN = 1006,
  MANIFEST_UNVERIFIED = 1007,
  NAME_INVALID = 1008,
  NAME_UNKNOWN = 1009,
  SIZE_INVALID = 1010,
  TAG_INVALID = 1011,
  UNAUTHORIZED = 1012,
  DENIED = 1013,
  UNSUPPORTED = 1014,
}

export default class DockerRegistryError {
  /**
   * BLOB_UNKNOWN
   * @message blob unknown to registry
   * @description This error may be returned when a blob is unknown to the registry in a specified repository. This can be returned with a standard get or if a manifest references an unknown layer during upload.
   */
  static BlobUnkown = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.BLOB_UNKNOWN,
    message: 'blob unknown to registry',
  });
  /**
   * BLOB_UPLOAD_INVALID
   * @message blob upload invalid
   * @description The blob upload encountered an error and can no longer proceed.
   */
  static BlobUploadInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.BLOB_UPLOAD_INVALID,
    message: 'blob upload invalid',
  });
  /**
   * BLOB_UPLOAD_UNKNOWN
   * @message blob upload unknown to registry
   * @description If a blob upload has been cancelled or was never started, this error code may be returned.
   */
  static BlobUploadUnkown = new ApiError({
    status: Status.NOT_FOUND,
    code: ErrorCode.BLOB_UPLOAD_UNKNOWN,
    message: 'blob upload unknown to registry',
  });
  /**
   * DIGEST_INVALID
   * @message provided digest did not match uploaded content
   * @description When a blob is uploaded, the registry will check that the content matches the digest provided by the client. The error may include a detail structure with the key “digest”, including the invalid digest string. This error may also be returned when a manifest includes an invalid layer digest.
   */
  static DigestInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.DIGEST_INVALID,
    message: 'provided digest did not match uploaded content',
  });
  /**
   * MANIFEST_BLOB_UNKNOWN
   * @message blob unknown to registry
   * @description This error may be returned when a manifest blob is unknown to the registry.
   */
  static ManifestBlobUnkown = new ApiError({
    status: Status.NOT_FOUND,
    code: ErrorCode.MANIFEST_BLOB_UNKNOWN,
    message: 'blob unknown to registry',
  });
  /**
   * MANIFEST_INVALID
   * @message manifest invalid
   * @description During upload, manifests undergo several checks ensuring validity. If those checks fail, this error may be returned, unless a more specific error is included. The detail will contain information the failed validation.
   */
  static ManifestInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.MANIFEST_INVALID,
    message: 'manifest invalid',
  });
  /**
   * MANIFEST_UNKNOWN
   * @message manifest unknown
   * @description This error is returned when the manifest, identified by name and tag is unknown to the repository.
   */
  static ManifestUnknown = new ApiError({
    status: Status.NOT_FOUND,
    code: ErrorCode.MANIFEST_UNKNOWN,
    message: 'manifest unknown',
  });
  /**
   * MANIFEST_UNVERIFIED
   * @message manifest failed signature verification
   * @description During manifest upload, if the manifest fails signature verification, this error will be returned.
   */
  static ManifestUnverified = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.MANIFEST_UNVERIFIED,
    message: 'manifest failed signature verification',
  });
  /**
   * NAME_INVALID
   * @message invalid repository name
   * @description Invalid repository name encountered either during manifest validation or any API operation.
   */
  static NameInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.NAME_INVALID,
    message: 'invalid repository name',
  });
  /**
   * NAME_UNKNOWN
   * @message repository name not known to registry
   * @description This is returned if the name used during an operation is unknown to the registry.
   */
  static NameUnknown = new ApiError({
    status: Status.NOT_FOUND,
    code: ErrorCode.NAME_UNKNOWN,
    message: 'repository name not known to registry',
  });
  /**
   * SIZE_INVALID
   * @message provided length did not match content length
   * @description When a layer is uploaded, the provided size will be checked against the uploaded content. If they do not match, this error will be returned.
   */
  static SizeInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.SIZE_INVALID,
    message: 'provided length did not match content length',
  });
  /**
   * TAG_INVALID
   * @message manifest tag did not match URI
   * @description During a manifest upload, if the tag in the manifest does not match the uri tag, this error will be returned.
   */
  static TagInvalid = new ApiError({
    status: Status.BAD_REQUEST,
    code: ErrorCode.TAG_INVALID,
    message: 'manifest tag did not match URI',
  });
  /**
   * UNAUTHORIZED
   * @message authentication required
   * @description The access controller was unable to authenticate the client. Often this will be accompanied by a Www-Authenticate HTTP response header indicating how to authenticate.
   */
  static Unauthorized = new ApiError({
    status: Status.UNAUTHORIZED,
    code: ErrorCode.UNAUTHORIZED,
    message: 'authentication required',
  });
  /**
   * DENIED
   * @message requested access to the resource is denied
   * @description The access controller denied access for the operation on a resource.
   */
  static Denied = new ApiError({
    status: Status.FORBIDDEN,
    code: ErrorCode.DENIED,
    message: 'requested access to the resource is denied',
  });
  /**
   * UNSUPPORTED
   * @message The operation is unsupported
   * @description The operation was unsupported due to a missing implementation or invalid set of parameters.
   */
  static Unsupported = new ApiError({
    status: Status.METHOD_NOT_ALLOWED,
    code: ErrorCode.UNSUPPORTED,
    message: 'The operation is unsupported',
  });
}
