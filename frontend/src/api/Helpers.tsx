import {
  GroceryItemFromApiType,
  GroceryItemType,
  ProductFromApiType,
  ProductType,
} from "./Types";

export const convertProductFromApi = (
  product: ProductFromApiType
): ProductType => ({
  ...product,
  price: Number(product.price),
});

export const convertGroceryItemFromApi = (
  i: GroceryItemFromApiType
): GroceryItemType => ({
  ...i,
  id: Number(i.id),
  quantity: Number(i.quantity),
});

export const convertGroceryItemToApi = (
  i: GroceryItemType
): GroceryItemFromApiType => ({
  ...i,
  id: i.id.toString(),
  quantity: i.quantity.toString(),
});
