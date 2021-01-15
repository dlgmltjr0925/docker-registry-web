import { Image, Registry } from '../interfaces';

import dateFormat from 'dateformat';
import getConfig from 'next/config';
import path from 'path';
import sqlite3 from 'sqlite3';

const { serverRuntimeConfig } = getConfig();
export const DB_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/docker-registry-ui.db'
);

const { Database } = sqlite3.verbose();

/**
 * Registry
 */
type InsertRegistryArgs = Omit<Registry, 'id'>;
export const insertRegistry = ({ name, url, token }: InsertRegistryArgs) => {
  return new Promise<Registry>((resolve, reject) => {
    const db = new Database(DB_FILE_PATH);
    db.run(
      'INSERT INTO registry (name, url, token) VALUES (?, ?, ?)',
      [name, url, token || null],
      (err) => {
        if (err) reject(err);
      }
    );
    db.get(
      'SELECT id FROM registry WHERE name=? AND url=? AND token=? ORDER BY id DESC;',
      [name, url, token || null],
      (err, row) => {
        if (err) reject(err);
        if (row) {
          resolve({
            id: row.id,
            name,
            url,
            token,
          });
        }
      }
    );
    db.close();
  });
};

export const selectRegistryById = (id: number) => {
  return new Promise<Registry | null>((resolve, reject) => {
    const db = new Database(DB_FILE_PATH);
    db.get('SELECT * FROM registry WHERE id=?;', [id], (err, row) => {
      if (err) reject(err);
      if (row) {
        resolve(row);
      } else {
        resolve(null);
      }
    });
    db.close();
  });
};

export const deleteRegistry = (id: number) => {
  return new Promise<boolean>((resolve, reject) => {
    const now = dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss');
    const db = new Database(DB_FILE_PATH);
    db.run(
      'UPDATE registry SET updated_at=?, deleted_at=? WHERE id=?',
      [now, now, id],
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
    db.close();
  });
};

export const selectRegistries = () => {
  return new Promise<Registry[]>((resolve, reject) => {
    const db = new Database(DB_FILE_PATH);
    db.all('SELECT * FROM registry WHERE deleted_at IS NULL;', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
    db.close();
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
        if (row) resolve(row);
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
      'SELECT * FROM image WHERE registry_id=? AND name=? AND deleted_at IS NOT NULL;',
      [registryId, name],
      (err, row) => {
        if (err) reject(err);
        if (row) {
          resolve(row);
        } else {
          resolve(null);
        }
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
