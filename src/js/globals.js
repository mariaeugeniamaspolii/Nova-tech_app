export const PRODUCTS_URL = "https://api.mercadolibre.com";
export const STORE_ID = "628";

export const USERS_URL = "https://user-api-64ni.onrender.com/api";

export let cartList = JSON.parse(localStorage.getItem("cartList")) || [];
export let favList= [];
export const status= {};
export const $={};

export const $search = document.querySelector("#searchbar");
export const $tabs = document.querySelector("ion-tabs");

export const CATEGORIES_URL = "./urlImages.json";