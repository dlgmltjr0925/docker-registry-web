// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:

export interface Layer {
  mediaType: string;
  size: number;
  digest: string;
}

export interface Tag {
  name: string;
  digest?: string;
  layers?: Layer[];
}
export interface Image {
  id?: number;
  registryId?: number;
  name: string;
  sourceRepositryUrl?: string;
}
export interface Registry {
  id: number;
  name: string;
  url: string;
  token?: string;
  images?: Image[];
  checkedDate?: string;
  status?: boolean;
}
