export type GroceryItemToApiType = {
  product: number;
  quantity: string;
  bought: boolean;
  list: number;
};

export type GroceryItemFromApiType = {
  id: string;
  product: number;
  quantity: string;
  bought: boolean;
  list: number;
  requested_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export type GroceryItemType = {
  id: number;
  product: number;
  quantity: number;
  bought: boolean;
  list: number;
  requested_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export type ProductToApiType = {
  name: string;
  price: string;
};

export type ProductFromApiType = {
  id: number;
  name: string;
  price: string;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
};

export type GroceryListType = {
  id: string;
  name: string;
  owner: {
    id: string;
    first_name: string;
    last_name: string;
  };
  members: {
    id: string;
    first_name: string;
    last_name: string;
  }[];
};

export type UserType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type TokensType = {
  access: string;
};

export type AccessTokenType = {
  access: string;
};
