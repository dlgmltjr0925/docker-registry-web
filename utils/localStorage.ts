import { Image } from '../schema/image';
import Joi from 'joi';
import { Registry } from '../schema/registry';
import fs from 'fs';
import getConfig from 'next/config';
import path from 'path';

const { serverRuntimeConfig } = getConfig();

export const STORAGE_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/docker-registry-ui.json'
);

interface Table<T> {
  seq: number;
  values: Array<T>;
}

type LocalStorage<T> = Record<string, Table<T>>;

let localStorage: null | LocalStorage<any> = null;

const getLocalStorage = <T = any>(): LocalStorage<T> => {
  if (!localStorage) {
    localStorage = JSON.parse(
      fs.readFileSync(STORAGE_FILE_PATH, 'utf-8')
    ) as LocalStorage<T>;
  }

  return localStorage;
};

const getTable = <T = any>(tableName: string): Table<T> => {
  const localStorage = getLocalStorage() as LocalStorage<T>;
  return localStorage[tableName];
};

const saveLocalStorage = <T>(data: LocalStorage<T>): void => {
  try {
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(data, null, 2), {
      encoding: 'utf-8',
    });
  } catch (error) {
    throw error;
  }
};

export interface InsertRegistryArgs {
  name: string;
  url: string;
  token?: string;
}

const insertRegistryInput = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  token: Joi.string(),
});

/**
 * Registry
 */
export const insertRegistry = ({ name, url, token }: InsertRegistryArgs) => {
  return new Promise<Registry>((resolve, reject) => {
    try {
      const { error } = insertRegistryInput.validate({ name, url, token });

      if (error) throw error;

      const localStorage = getLocalStorage<Registry>();
      const registry = localStorage['registry'];

      const newRegistry: Registry = {
        id: ++registry.seq,
        name,
        url,
        token,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      registry.values.push(newRegistry);

      saveLocalStorage(localStorage);

      resolve(newRegistry);
    } catch (error) {
      reject(error);
    }
  });
};

export const selectRegistryById = (id: number) => {
  return new Promise<Registry | null>((resolve, reject) => {
    try {
      const registry = getTable<Registry>('registry');
      const result = registry.values.find((item) => item.id === id);
      resolve(result || null);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteRegistry = (id: number) => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const localStorage = getLocalStorage();
      const registry = localStorage['registry'];
      registry.values = registry.values.filter((item) => item.id !== id);

      saveLocalStorage(localStorage);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const getRegistries = () => {
  return new Promise<Registry[]>((resolve, reject) => {
    try {
      const registry = getTable<Registry>('registry');
      resolve(registry.values);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Image
 */
interface ImageByIdAndNameArgs {
  registryId: number;
  name: string;
}

const imageByIdAndNameInput = Joi.object({
  registryId: Joi.number().required(),
  name: Joi.string().required(),
});

export const insertImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<Image>((resolve, reject) => {
    try {
      const { error } = imageByIdAndNameInput.validate({ registryId, name });
      if (error) throw error;

      const localStorage = getLocalStorage();
      const image = localStorage['image'] as Table<Image>;

      const newImage: Image = {
        id: ++image.seq,
        registryId: registryId,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      image.values.push(newImage);

      saveLocalStorage(localStorage);

      resolve(newImage);
    } catch (error) {
      reject(error);
    }
  });
};

export const selectImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<Image | null>((resolve, reject) => {
    try {
      const { error } = imageByIdAndNameInput.validate({ registryId, name });
      if (error) throw error;

      const image = getTable<Image>('image');

      const result = image.values.find(
        (item) => item.registryId === registryId && item.name === name
      );

      resolve(result || null);
    } catch (error) {
      reject(error);
    }
  });
};

interface UpdateImageByIdAndNameArgs extends ImageByIdAndNameArgs {
  repositoryUrl: string;
}

const updateImageByIdAndNameInput = Joi.object({
  registryId: Joi.number().required(),
  name: Joi.string().required(),
  repositoryUrl: Joi.string(),
});

export const updateImageByIdAndName = ({
  registryId,
  name,
  repositoryUrl,
}: UpdateImageByIdAndNameArgs) => {
  return new Promise<Image | null>((resolve, reject) => {
    try {
      const { error } = updateImageByIdAndNameInput.validate({
        registryId,
        name,
        repositoryUrl,
      });
      if (error) throw error;

      const localStorage = getLocalStorage();
      const image = localStorage['image'] as Table<Image>;

      const index = image.values.findIndex(
        (item) => item.registryId === registryId && item.name
      );

      if (index === -1) return resolve(null);

      image.values[index].sourceRepositoryUrl = repositoryUrl;

      saveLocalStorage(localStorage);

      resolve(image.values[index]);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const { error } = imageByIdAndNameInput.validate({
        registryId,
        name,
      });
      if (error) throw error;

      const localStorage = getLocalStorage();
      const image = localStorage['image'] as Table<Image>;

      image.values = image.values.filter(
        (item) => !(item.registryId === registryId && item.name === name)
      );

      saveLocalStorage(localStorage);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
