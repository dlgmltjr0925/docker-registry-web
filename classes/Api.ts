import ApiError, { Status } from './ApiError';
import { NextApiRequest, NextApiResponse } from 'next';
import { response404, response500 } from '../utils/api';

export default class Api {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.handler = this.handler.bind(this);
  }

  async get(_: NextApiRequest, res: NextApiResponse) {
    throw ApiError.ERROR_404;
  }

  async post(_: NextApiRequest, res: NextApiResponse) {
    throw ApiError.ERROR_404;
  }

  async put(_: NextApiRequest, res: NextApiResponse) {
    throw ApiError.ERROR_404;
  }

  async delete(_: NextApiRequest, res: NextApiResponse) {
    throw ApiError.ERROR_404;
  }

  async handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      switch (req.method) {
        case 'GET':
          await this.get(req, res);
          break;
        case 'POST':
          await this.post(req, res);
          break;
        case 'PUT':
          await this.put(req, res);
          break;
        case 'DELETE':
          await this.delete(req, res);
          break;
        default:
          throw ApiError.ERROR_404;
          break;
      }
    } catch (error) {
      console.error(error);
      const { status, message } = error;
      if (status && message) {
        return res.status(status).json({ message });
      } else {
        return res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error' });
      }
    }
  }
}
