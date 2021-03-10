// "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
// "registry_id"	INTEGER NOT NULL,
// "name"	TEXT NOT NULL,
// "source_repository_url": TEXT,
// "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
// "updated_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
// "deleted_at"	TEXT

import Joi from 'joi';

export interface Image {
  id: number;
  registry_id: number;
  name: string;
  source_repository_url?: string;
  created_at: Date;
  updated_at: Date;
}

export const imageObject = Joi.object({
  id: Joi.number().required(),
  registry_id: Joi.number().required(),
  name: Joi.string().required(),
  source_repository_url: Joi.string(),
  created_at: Joi.date().required(),
  updated_at: Joi.date().required(),
});
