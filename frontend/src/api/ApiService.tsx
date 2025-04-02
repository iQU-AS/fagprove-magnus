import { toastMachine } from "../components/utils/ToastMachine";
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

const showToast = (title: string, description: string) => {
  toastMachine.create({
    type: "error",
    title,
    description,
    duration: 5000,
  });
};

export const apiService = {
  auth: {
    login: (username: string, password: string): Promise<TokensType> =>
      apiClient
        .post("/auth/login/", { username, password }, { withCredentials: true })
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
      apiClient
        .get(`/single-grocery-list/${list_id}/`)
        .then((res) => res.data)
        .catch((err) => {
          showToast(
            "Kunne ikke hente handleliste",
            "Noe gikk galt ved henting av handleliste."
          );
          throw err;
        }),

    get_lists: (): Promise<GroceryListType[]> =>
      apiClient
        .get("/grocery-lists/")
        .then((res) => res.data)
        .catch((err) => {
          showToast(
            "Kunne ikke hente handlelister",
            "Noe gikk galt ved henting av handlelister."
          );
          throw err;
        }),

    create_list: (data: { name: string }): Promise<GroceryListType> =>
      apiClient
        .post("/grocery-lists/", data)
        .then((res) => res.data)
        .catch((err) => {
          showToast(
            "Kunne ikke opprette handleliste",
            "Noe gikk galt ved opprettelse av handleliste."
          );
          throw err;
        }),

    delete_list: (list_id: number): Promise<void> =>
      apiClient
        .delete(`/grocery-lists/${list_id}/`)
        .then(() => {})
        .catch((err) => {
          showToast(
            "Kunne ikke slette handleliste",
            "Noe gikk galt ved sletting av handleliste."
          );
          throw err;
        }),

    invite_to_list: (list_id: number) =>
      apiClient.post(`/grocery-lists/${list_id}/invite/`).catch((err) => {
        showToast(
          "Kunne ikke sende invitasjon",
          "Noe gikk galt ved sending av invitasjon."
        );
        throw err;
      }),

    accept_invite: (token: string) =>
      apiClient.post(`/join-list/${token}/`).catch((err) => {
        showToast(
          "Kunne ikke akseptere invitasjon",
          "Noe gikk galt ved aksept av invitasjon."
        );
        throw err;
      }),

    leave_list: (list_id: number) =>
      apiClient.post(`/grocery-lists/${list_id}/leave/`).catch((err) => {
        showToast(
          "Kunne ikke forlate handleliste",
          "Noe gikk galt ved forlatelse av handleliste."
        );
        throw err;
      }),

    finish_shopping: (list_id: number, items_bought: number[]) =>
      apiClient
        .post(`/grocery-lists/${list_id}/finish-shopping/`, {
          item_ids: items_bought,
        })
        .catch((err) => {
          showToast(
            "Kunne ikke fullføre handletur",
            "Noe gikk galt ved fullføring av handletur."
          );
          throw err;
        }),
  },

  grocery_item: {
    get_items_in_list: (list_id: number): Promise<GroceryItemType[]> =>
      apiClient
        .get(`/grocery-items/${list_id}/`)
        .then((response) => response.data.map(convertGroceryItemFromApi))
        .catch((err) => {
          showToast(
            "Kunne ikke hente varer",
            "Noe gikk galt ved henting av varer."
          );
          throw err;
        }),

    add_item_to_list: (
      list_id: number,
      data: GroceryItemToApiType
    ): Promise<GroceryItemType> =>
      apiClient
        .post(`/grocery-items/${list_id}/`, data)
        .then((response) => convertGroceryItemFromApi(response.data))
        .catch((err) => {
          showToast(
            "Kunne ikke legge til vare",
            "Noe gikk galt ved legging til vare."
          );
          throw err;
        }),

    edit_item_in_list: (
      list_id: number,
      id: number,
      data: GroceryItemToApiType
    ): Promise<GroceryItemType> =>
      apiClient
        .put(`/grocery-items/${list_id}/${id}/`, data)
        .then((response) => convertGroceryItemFromApi(response.data))
        .catch((err) => {
          showToast(
            "Kunne ikke redigere vare",
            "Noe gikk galt ved redigering av vare."
          );
          throw err;
        }),

    delete_item_in_list: (list_id: number, id: number): Promise<void> =>
      apiClient
        .delete(`/grocery-items/${list_id}/${id}/`)
        .then(() => {})
        .catch((err) => {
          showToast(
            "Kunne ikke slette vare",
            "Noe gikk galt ved sletting av vare."
          );
          throw err;
        }),

    get_bought_items: (range: string): Promise<BoughtItemType[]> =>
      apiClient
        .get(`/bought-items/?range=${range}`)
        .then((response) => response.data.map(convertGroceryItemFromApi))
        .catch((err) => {
          showToast(
            "Kunne ikke hente kjøpte varer",
            "Noe gikk galt ved henting av kjøpte varer."
          );
          throw err;
        }),
  },

  product: {
    get_products: (onlyMine: boolean = false): Promise<ProductType[]> =>
      apiClient
        .get("/products/" + (onlyMine ? "?only_mine=true" : ""))
        .then((response) => response.data.map(convertProductFromApi))
        .catch((err) => {
          showToast(
            "Kunne ikke hente produkter",
            "Noe gikk galt ved henting av produkter."
          );
          throw err;
        }),

    create_product: (data: ProductToApiType): Promise<ProductType> =>
      apiClient
        .post("/products/", data)
        .then((response) => convertProductFromApi(response.data))
        .catch((err) => {
          showToast(
            "Kunne ikke opprette produkt",
            "Noe gikk galt ved opprettelse av produkt."
          );
          throw err;
        }),

    delete_product: (id: string): Promise<ProductType> =>
      apiClient
        .delete(`/products/${id}/`)
        .then((response) => convertProductFromApi(response.data))
        .catch((err) => {
          showToast(
            "Kunne ikke slette produkt",
            "Noe gikk galt ved sletting av produkt."
          );
          throw err;
        }),
  },
};
