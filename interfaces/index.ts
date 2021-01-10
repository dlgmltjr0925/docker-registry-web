// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
export interface Image {
  name: string;
}
export interface Registry {
  id: number;
  name: string;
  url: string;
  port?: string;
  token?: string;
  images?: Image[];
  checkedDate?: string;
  status?: boolean;
}
