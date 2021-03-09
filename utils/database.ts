import { Image } from '../interfaces';
import Joi from 'joi';
import { Registry } from '../schema/registry';
import dateFormat from 'dateformat';
import fs from 'fs';
import getConfig from 'next/config';
import path from 'path';
import sqlite3 from 'sqlite3';

const { serverRuntimeConfig } = getConfig();
export const DB_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/docker-registry-ui.db'
);

export const STORAGE_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/docker-registry-ui.json'
);

const { Database } = sqlite3.verbose();

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
        created_at: new Date(),
        updated_at: new Date(),
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
export const insertImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<Image>((resolve, reject) => {
    const db = new Database(DB_FILE_PATH);
    db.run(
      'INSERT INTO image (registry_id, name) VALUES (?, ?)',
      [registryId, name],
      (err) => {
        if (err) reject(err);
      }
    );
    db.get(
      'SELECT * FROM image WHERE registry_id=? AND name=? ORDER BY id DESC;',
      [registryId, name],
      (err, row) => {
        if (err) reject(err);
        if (row)
          resolve({ ...row, sourceRepositryUrl: row.source_repository_url });
      }
    );
    db.close();
  });
};

export const selectImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<Image | null>((resolve, reject) => {
    const db = new Database(DB_FILE_PATH);
    db.get(
      'SELECT * FROM image WHERE registry_id=? AND name=? AND deleted_at IS NULL;',
      [registryId, name],
      (err, row) => {
        if (err) reject(err);
        if (row) {
          resolve({ ...row, sourceRepositryUrl: row.source_repository_url });
        } else {
          resolve(null);
        }
      }
    );
    db.close();
  });
};

interface UpdateImageByIdAndNameArgs extends ImageByIdAndNameArgs {
  repositoryUrl: string;
}

export const updateImageByIdAndName = ({
  registryId,
  name,
  repositoryUrl,
}: UpdateImageByIdAndNameArgs) => {
  return new Promise<Image | null>((resolve, reject) => {
    const now = dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss');
    const db = new Database(DB_FILE_PATH);

    db.run(
      `UPDATE image 
      SET source_repository_url=?, updated_at=? 
      WHERE registry_id=? AND name=? AND deleted_at IS NULL;`,
      [repositoryUrl, now, registryId, name],
      (err) => {
        if (err) reject(err);
      }
    );

    db.get(
      `SELECT * FROM image 
      WHERE registry_id=? AND name=? AND deleted_at IS NULL
      ORDER BY id DESC;`,
      [registryId, name],
      (err, row) => {
        console.log(err);
        if (err) reject(err);
        if (row)
          resolve({ ...row, sourceRepositryUrl: row.source_repository_url });
        else resolve(null);
      }
    );
    db.close();
  });
};

export const deleteImageByIdAndName = ({
  registryId,
  name,
}: ImageByIdAndNameArgs) => {
  return new Promise<boolean>((resolve, reject) => {
    const now = dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss');
    const db = new Database(DB_FILE_PATH);
    db.run(
      'UPDATE image SET deleted_at=? WHERE registry_id=? AND name=? AND deleted_at IS NULL;',
      [now, registryId, name],
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
    db.close();
  });
};
