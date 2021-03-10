import Joi from 'joi';

export interface Registry {
  id: number;
  name: string;
  url: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const registryObject = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  token: Joi.string(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});
