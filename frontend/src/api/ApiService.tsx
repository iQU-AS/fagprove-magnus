import apiClient from "./ApiClient";
import { convertGroceryItemFromApi, convertProductFromApi } from "./Helpers";
import {
  AccessTokenType,
  BoughtItemType,
  GroceryItemToApiType,
  GroceryItemType,
  GroceryListType,
  ProductToApiType,
  ProductType,
  TokensType,
  UserType,
} from "./Types";

export const apiService = {
  auth: {
    login: (username: string, password: string): Promise<TokensType> =>
      apiClient
        .post(
          "/auth/login/",
          { username, password },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data),

    register: (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ): Promise<TokensType> =>
      apiClient
        .post("/auth/register/", {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
        })
        .then((res) => res.data),

    refresh: (): Promise<AccessTokenType> =>
      apiClient
        .post("/auth/refresh/", {}, { withCredentials: true })
        .then((res) => res.data),

    logout: (): Promise<void> =>
      apiClient.post("/auth/logout/", {}, { withCredentials: true }),
  },

  user: {
    get_user: (): Promise<UserType> =>
      apiClient.get("/user/").then((res) => res.data),
  },

  grocery_list: {
    get_single: (list_id: number): Promise<GroceryListType> =>
      apiClient.get(`/single-grocery-list/${list_id}/`).then((res) => res.data),

    get_lists: (): Promise<GroceryListType[]> =>
      apiClient.get("/grocery-lists/").then((res) => res.data),

    create_list: (data: { name: string }): Promise<GroceryListType> =>
      apiClient.post("/grocery-lists/", data).then((res) => res.data),

    delete_list: (list_id: number): Promise<void> =>
      apiClient.delete(`/grocery-lists/${list_id}/`),

    invite_to_list: (list_id: number) =>
      apiClient.post(`/grocery-lists/${list_id}/invite/`),

    accept_invite: (token: string) => apiClient.post(`/join-list/${token}/`),

    leave_list: (list_id: number) =>
      apiClient.post(`/grocery-lists/${list_id}/leave/`),

    finish_shopping: (list_id: number, items_bought: number[]) =>
      apiClient.post(`/grocery-lists/${list_id}/finish-shopping/`, {
        item_ids: items_bought,
      }),
  },

  grocery_item: {
    get_items_in_list: (list_id: number): Promise<GroceryItemType[]> =>
      apiClient
        .get(`/grocery-items/${list_id}/`)
        .then((response) => response.data.map(convertGroceryItemFromApi)),

    add_item_to_list: (
      list_id: number,
      data: GroceryItemToApiType
    ): Promise<GroceryItemType> =>
      apiClient
        .post(`/grocery-items/${list_id}/`, data)
        .then((response) => convertGroceryItemFromApi(response.data)),

    edit_item_in_list: (
      list_id: number,
      id: number,
      data: GroceryItemToApiType
    ): Promise<GroceryItemType> =>
      apiClient
        .put(`/grocery-items/${list_id}/${id}/`, data)
        .then((response) => convertGroceryItemFromApi(response.data)),

    delete_item_in_list: (list_id: number, id: number): Promise<void> =>
      apiClient.delete(`/grocery-items/${list_id}/${id}/`),

    get_bought_items: (range: string): Promise<BoughtItemType[]> =>
      apiClient
        .get(`/bought-items/?range=${range}`)
        .then((response) => response.data.map(convertGroceryItemFromApi)),
  },

  product: {
    get_products: (): Promise<ProductType[]> =>
      apiClient
        .get("/products/")
        .then((response) => response.data.map(convertProductFromApi)),

    create_product: (data: ProductToApiType): Promise<ProductType> =>
      apiClient
        .post("/products/", data)
        .then((response) => convertProductFromApi(response.data)),

    delete_product: (id: string): Promise<ProductType> =>
      apiClient
        .delete(`/products/${id}/`)
        .then((response) => convertProductFromApi(response.data)),
  },
};
