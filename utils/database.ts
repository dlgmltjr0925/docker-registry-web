import getConfig from 'next/config';
import path from 'path';
import sqlite3 from 'sqlite3';

const { serverRuntimeConfig } = getConfig();
export const REGISTRY_FILE_PATH = path.join(
  serverRuntimeConfig.PROJECT_ROOT,
  'data/docker-registry-ui.db'
);

const { Database } = sqlite3.verbose();

const db = new Database(REGISTRY_FILE_PATH);

export const initialize = () => {
  /**
   * create registry table
   * CREATE TABLE "registry" (
   *   "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
   *   "name"	TEXT NOT NULL,
   *   "url"	TEXT NOT NULL,
   *   "token"	INTEGER
   * );
   */
  try {
    db.run(`
    CREATE TABLE "registry" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name"	TEXT NOT NULL,
      "url"	TEXT NOT NULL,
      "token"	INTEGER,
      "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "deleted_at"	TEXT
    );
    `);

    db.run(`
    CREATE TABLE "image" (
      "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
      "registry_id"	INTEGER NOT NULL,
      "name"	TEXT NOT NULL,
      "alias"	TEXT,
      "summary"	TEXT,
      "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "deleted_at"	TEXT
    );
    `);

    db.run(`
    CREATE TABLE "tag_hash" (
      "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
      "hash"	TEXT NOT NULL,
      "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "deleted_at"	TEXT
    );
    `);

    db.run(`
    CREATE TABLE "tag" (
      "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
      "image_id"	INTEGER NOT NULL,
      "tag_hash_id"	INTEGER NOT NULL,
      "tag"	INTEGER,
      "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "deleted_at"	TEXT
    );
    `);
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
};
