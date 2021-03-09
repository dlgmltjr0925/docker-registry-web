import Joi from 'joi';

export interface Registry {
  id: number;
  name: string;
  url: string;
  token?: string;
  created_at: Date;
  updated_at: Date;
}

export const registryObject = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  token: Joi.string(),
  created_at: Joi.date().required(),
  updated_at: Joi.date().required(),
});
