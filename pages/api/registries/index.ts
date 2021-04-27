import { NextApiRequest, NextApiResponse } from "next";

import Api from "../../../utils/Api";
import { Registry } from "../../../interfaces";
import { Status } from "../../../utils/ApiError";
import { getRegistries } from "../../../utils/localStorage";
import {
  GetImagesArgs,
  getImages,
  getTags,
} from "../../../utils/dockerRegistry";
import { promiseAll } from "../../../utils/async";
import { ApiResult } from "../../../interfaces/api";
class RegistryApi extends Api {
  async get(_: NextApiRequest, res: NextApiResponse) {
    try {
      const results = await getRegistries();

      const registries = (await promiseAll(
        results.map(async (registry) => {
          const { url, token } = registry;
          try {
            const getImageArgs: GetImagesArgs = { host: url };

            if (token) getImageArgs.authorization = `Basic ${token}`;

            const images = await getImages(getImageArgs);

            const imagesWithTags = await promiseAll(
              images.map(async (name: string) => {
                return await getTags({
                  ...getImageArgs,
                  name,
                });
              })
            );

            return {
              ...registry,
              images: imagesWithTags,
              checkedDate: new Date().toString(),
              status: true,
            };
          } catch (error) {
            console.error(error);
            return {
              ...registry,
              checkedDate: new Date().toString(),
              status: false,
            };
          }
        })
      )) as Registry[];

      const result: ApiResult<Registry[]> = {
        status: 200,
        message: "success",
        data: registries,
      };

      res.status(Status.OK).json(result);
    } catch (error) {
      throw error;
    }
  }
}

const registryApi = new RegistryApi();

export default registryApi.handler;
