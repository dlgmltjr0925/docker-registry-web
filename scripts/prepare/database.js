const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data/docker-registry-ui.db');

db.serialize(() => {
  db.all(`SELECT tbl_name FROM sqlite_master;`, (err, rows) => {
    if (err) throw err;
    const tables = rows.map(({ tbl_name }) => tbl_name);
    if (!tables.includes('registry')) {
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
    }
    if (!tables.includes('image')) {
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
    }
    if (!tables.includes('tag_hash')) {
      db.run(`
        CREATE TABLE "tag_hash" (
          "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
          "hash"	TEXT NOT NULL,
          "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deleted_at"	TEXT
        );
      `);
    }
    if (!tables.includes('tag')) {
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
    }
    db.close();
  });
});
