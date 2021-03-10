import Joi from 'joi';

export interface Image {
  id: number;
  registryId: number;
  name: string;
  sourceRepositoryUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const imageObject = Joi.object({
  id: Joi.number().required(),
  registryId: Joi.number().required(),
  name: Joi.string().required(),
  sourceRepositoryUrl: Joi.string(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});
