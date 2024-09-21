import { 
    PRODUCTS_URL,
    STORE_ID,
    USERS_URL,
    status,
    $,
    cartList,
    favList,
    CATEGORIES_URL} from "./globals.js";

import { 
    apiToJson,
    getLocalStorage, 
    setLocalStorage, 
    buildUrl, 
    createSwiper, 
    showToastSuccess, 
    showToastError,
    } from "./utils.js";

    import { Share } from '@capacitor/share';



export async function shareLink(cardElement){
    let itemData = {
        id: cardElement.attributes.id.value,
        title: cardElement.attributes.name.value,
        price: cardElement.attributes.price.value,
        currency: cardElement.attributes.currency.value,
        thumbnail: JSON.parse(decodeURIComponent(cardElement.attributes.images.value))[0].secure_url,
        link: cardElement.attributes.link.value,
        }
    // }
    await Share.share({
        title: itemData.title,
        text: 'Compartiendo desde NOMBRE APP',
        url: itemData.link,
        dialogTitle: 'Comparte tu descubrimiento',
    });
    console.log("SHARING")
}

let params = {
    official_store_id: STORE_ID,
};

let $selectedFiltersGroup = "";
let $oneFilterValue = '';
let $sortBy = '';
  
function printCategories(params) {
    fetchProducts(params)
      .then((apiJson) => {
  
        const oneFilter = apiJson.available_filters.find((filter) => filter.id === "category");
        console.log('oneFilter: ', oneFilter);
        if (oneFilter !== undefined) {
          const arrayFilters = oneFilter.values;
          let html = '';
          fetch(CATEGORIES_URL)
            .then(apiToJson)
            .then((data) => {
              const categories = data.categories;
              for (let element of arrayFilters) {
                const category = categories.find((cat) => cat.id === element.id);
                const imageUrl = category && category.url !== "" ? category.url : "public/img/audio.jpg";
                html +=
                  `
                  <div class="swiper-slide" style="height: unset;">
                    <ion-card>
                      <img class="rounded-circle" alt="Silhouette of mountains" src="${imageUrl}" />
                      <ion-card-header>
                        <ion-card-subtitle class="text-center">${element.name}</ion-card-subtitle>
                      </ion-card-header>
                    </ion-card>
                  </div>
                  `;
              }
              document.querySelector(".all-categories").innerHTML = "";
              document.querySelector(".all-categories").innerHTML +=
                `
                <ion-title>
                  <h5>Categorías</h5>
                </ion-title>
                <div class="swiper swiper-all-categories">
                  <!-- Additional required wrapper -->
                  <div class="swiper-wrapper">
                    <!-- Slides -->
                    ${html}
                  </div>
                </div>
                `;
              let customSwiper = {
                slidesPerView: 3.8,
                centeredSlides: false,
                spaceBetween: 16,
                loop: false,
                pagination: {
                  clickable: true,
                },
              };
              createSwiper("all-categories", customSwiper);
            })
            .catch((error) => {
              console.error('Error fetching categories JSON:', error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching product list:", error);
      });
  }
  
  export async function loadTabHome() {
    printCategories(params);
    getMostSold();
    getSaleProducts();
  
    if (status.userLogged !== undefined) {
      printUserInfo(status.userLogged);
    } else {
      console.log("user NOT LOGGED");
      getUserInfo();
    }
    console.log("CARTLIST", cartList);
  }
  
  function fetchProducts() {
    return fetch(buildUrl(PRODUCTS_URL + "/sites/MLU/search/", params)).then(apiToJson);
  }
  
  function getMostSold() {
    fetchProducts(params)
      .then((apiJson) => {
        const productList = apiJson.results;
  
        productList.sort((a, b) => b.sold_quantity - a.sold_quantity);
        const mostSold = productList.slice(0, 5);
  
        const mostSoldSections = document.querySelectorAll(".most-sold");
        const productPromises = mostSold.map((product) =>
          getProductDetail(product.id)
        );
  
        Promise.all(productPromises)
          .then((productDetails) => {
            mostSoldSections.forEach((section) => {
              printProductCards(productDetails, section);
            });
          })
          .catch((error) => {
            console.error("Error fetching product details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching product list:", error);
      });
  }
  
  function printProductCards(productList, insertAt) {
    let currency = "$";
    let html = ``;
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      currency = product.currency_id === "USD" ? "U$S" : currency;
      html += `
          <div class="swiper-slide" style="height: unset;">
              <card-product
              name="${product.title}"
              id="${product.id}"
              currency="${currency}"
              price="${product.price}"
              shipping="${product.shipping.free_shipping}"
              image="${product.pictures[0].secure_url}"
              ></card-product>
          </div>
      `;
    }
    insertAt.innerHTML = `
        <ion-title>
            <h5>Los más vendidos</h5>
        </ion-title>
        <div class="swiper swiper-mostSold">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                ${html}
            </div>
        </div>
    `;
    let customSwiper = {
        slidesPerView: 2.1,
        centeredSlides: false,
        spaceBetween: 8,
        pagination: {
          clickable: true,
        },
      };
    createSwiper("mostSold", customSwiper);
}


function getSaleProducts(){
    fetchProducts(params)
    .then((apiJson)=>{
        const productList = apiJson.results;
        const saleProduct = productList.filter((product) => product.shipping.free_shipping === true).slice(0, 5);
        printItemProduct(saleProduct, ".home-content .sale-list", "Envío gratis")
    })
}

function printItemProduct(productList, insertAt, contentTitle){
    let currency ="$";
    let html= '';
    for (let product of productList) {
        let shipping = product.shipping?.free_shipping ?? "";
        let sold = product.sold_quantity?.toString() ?? "";
        currency = product.currency_id === "USD" ? "U$S" : currency;

        const originalUrl = product.thumbnail;
        const secureUrl = originalUrl.replace("http://", "https://");


        let listItem = "";
        let itemAmount = 1;

        if(insertAt === ".cart-list"){
            listItem = "true";
            currency = product.currency;
            itemAmount = product.amount;
        }
        html +=
            `<item-product
                name="${product.title}"
                id="${product.id}"
                currency="${currency}"
                price="${product.price}"
                shipping="${shipping}"
                sold="${sold}"
                image="${secureUrl}"
                listItem="${listItem}"
                stock="${product.stock}"
                amount="${itemAmount}"
            ></item-product>
            `;
    }
    document.querySelector(insertAt).innerHTML = 
        `
        <ion-title>
        <h5>${contentTitle}</h5>
    </ion-title>
    <ion-card >
    <ion-list>
    ${html}
    </ion-list>
    </ion-card>
        `
}

function getProductList(size, insertAt, params, nextPage) {
    fetchProducts(params)
    .then((apiJson) => {
        $.offsetPoint = apiJson.paging.offset;
        $.totalItems = apiJson.paging.total;
        $.itemsCount = apiJson.paging.total + " items";
        const products = apiJson.results;
        const productPromises = products.map((product) =>
            getProductDetail(product.id)
        );
        document.querySelectorAll(".items-count").forEach((element) => {
            element.innerHTML = $.itemsCount;
            
        })

        Promise.all(productPromises)
        .then((productDetails) => {
            let html = "";
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const productDetail = productDetails[i];
                let currency = "$";
                currency = product.currency_id === "USD" ? "U$S" : currency;
                html += `
                    <ion-col size="${size}">
                        <card-product
                        name="${product.title}"
                        id="${product.id}"
                        currency="${currency}"
                        price="${product.price}"
                        shipping="${product.shipping.free_shipping}"
                        image="${productDetail.pictures[0].secure_url}"
                        ></card-product>
                    </ion-col>
                    `;
            }

            if(nextPage){
                console.log("NOT RESET", $.offsetPoint)
                document.querySelector(insertAt + ` ion-grid ion-row`).innerHTML += 
                    html;
            } else {
                $.offsetPoint = 0;
                console.log("RESET", $.offsetPoint)
                document.querySelector(insertAt).innerHTML = 
                `
                <ion-grid>
                <ion-row>
                ${html}
                </ion-row>
                </ion-grid>
                `;
            }
        })
        .catch((error) => {
            console.error("Error fetching product details:", error);
        });
        })
        .catch((error) => {
            console.error("Error fetching product list:", error);
        });
        // return (offsetPoint, totalItems)
}

function getProductDescription(id) {
    return fetch(`${PRODUCTS_URL}/items/${id}/description`)
        .then(apiToJson)
        .then((apiJson) => {
            return apiJson.plain_text;
        });
}

function getProductDetail(id) {
    return Promise.all([
        fetch(`${PRODUCTS_URL}/items/${id}`).then(apiToJson),
        getProductDescription(id)
    ]).then(([productDetail, description]) => {
        productDetail.description = description;
        return productDetail;
    });
}

export function loadTabDetail(id) {
    getProductDetail(id)
        .then((productDetail) => {
            printProductDetail(productDetail);
            document.querySelectorAll(".btn-share-link").forEach((item) => {
                item.addEventListener("click", (event) => {
                    const cardElement = event.target.closest("card-product-detail");
                    shareLink(cardElement)
                });
            });
            getCartList(cartList);
            updateButtonClass(id);
            document.querySelectorAll(".btn-add-cart").forEach((item) => {
                item.addEventListener("click", (event) => {
                    const cardElement = event.target.closest("card-product-detail");
                    let itemData = {
                        id: cardElement.attributes.id.value,
                        title: cardElement.attributes.name.value,
                        price: cardElement.attributes.price.value,
                        currency: cardElement.attributes.currency.value,
                        stock: cardElement.attributes.stock.value,
                        amount: cardElement.attributes.amount.value,
                        thumbnail: JSON.parse(decodeURIComponent(cardElement.attributes.images.value))[0].secure_url,

                        // image: cardElement.attributes.image.value,
                    }
                    item.classList.toggle("inverted-color");
                    addToCartList(itemData);
                    updateButtonClass(id);
                });
            })
        })
        .catch((error) => {
        console.error("Error fetching product detail:", error);
        });
}

function updateButtonClass(id) {    
    const buttons = document.querySelectorAll(".btn-add-cart");
    buttons.forEach((button) => {
        const dataId = button.getAttribute("data-id-cart");
        const cartItem = cartList.find((item) => item.id === id);
        if (cartItem) {
            button.classList.remove("inverted-color");
        }
    });
}

function printProductDetail(product) {
    let currency = "$";
    currency = product.currency_id === "USD" ? "U$S" : currency;
    const imagesJson = JSON.stringify(product.pictures);
    const encodedImagesJson = encodeURIComponent(imagesJson);
    let htmlProduct = `
    <card-product-detail
    id="${product.id}"
    name="${product.title}"
    currency="${currency}"
    price="${product.price}"
    link="${product.permalink}"
    images="${encodedImagesJson}"
    shipping="${product.shipping.free_shipping}"
    brand="${product.attributes.find(attr => attr.id === "BRAND").values[0].name}"
    description="${product.description}"
    stock="${product.available_quantity}"
    amount="1"
    ></card-product-detail>
    `;
    document.querySelector(".product-detail").innerHTML = htmlProduct;
    let customSwiper = "";
    createSwiper("detail", customSwiper);
}

export function loadTabCart(){
    printCartList(getCartList(cartList));
}

function addToCartList(item){
    if(!cartList.some((cartItem) => cartItem.id === item.id)){
        cartList.push(item);
        setLocalStorage("cartList", cartList)
        loadTabCart(cartList)
        showToastSuccess("Agregado al carrito")
    } else {
        const index = cartList.findIndex((cartItem) => cartItem.id === item.id);
        if (index !== -1) {
            cartList.splice(index, 1);
        }
    }
        setLocalStorage("cartList", cartList)
        loadTabCart(cartList)
}

export function changeSelectedAmount(id, selectedItem, amount){
    console.log("VALUE SELECTED", selectedItem.value)
    console.log("ID AND AMOUNT", id, amount)
    updateAmountInCart(id, amount, cartList)
    printCartList(cartList);
}

function updateAmountInCart(id, amount, cartList){
    const itemToUpdate = cartList.find(item => item.id === id);
    if (itemToUpdate) {
        itemToUpdate.amount = amount;
        setLocalStorage("cartList", cartList);
    }
}

function getCartList(cartList){
    cartList = getLocalStorage("cartList")
    console.log("CARTLIST",cartList)
    return cartList;
}

function printCartList(cartList){

    if(cartList.length === 0 || cartList === null){
        document.querySelector(".cart-list").innerHTML = `
        <ion-title><h5>Tu carrito de compras se siente solo!</h5></ion-title>
        <ion-subtitle><h6>  Explora y encuentra los mejores productos para ti</h6></ion-subtitle>
        <div class="most-sold">

        <ion-title>
        <h5><ion-skeleton-text animated style="width: 50%; height: 24px;"></ion-skeleton-text></h5>
    </ion-title>
    <ion-grid>
    <ion-row>
    <ion-col>
    <ion-card>
    <skeleton-product-swipercards></skeleton-product-swipercards>
    </ion-card>
    </ion-col>
    <ion-col>
    <ion-card>
    <skeleton-product-swipercards></skeleton-product-swipercards>
    </ion-card>
    </ion-col>
    </ion-row>
    </ion-grid>
    </div>
        <ion-button expand="full" class="ion-margin-vertical btn-seeProducts">Ver productos</ion-button>
        `
        getMostSold();

        const $seeProducts = document.querySelector(".btn-seeProducts");
        console.log('$seeProducts: ', $seeProducts);

        $seeProducts.addEventListener('click', function() {
            navTabSearch()
        });
    } else {

        printItemProduct(cartList, ".cart-list", "Carrito");
        printTotalCartList(cartList)
            .then((totalContent) => {
                document.querySelector(".total-price").innerHTML = totalContent;
            })
            .catch((error) => {
                document.querySelector(".total-price").innerHTML = "Error al obtener el total";
            });
        removeFromCartList();
        addUnitItem();
    }
}


function convertPrice(usdAmount) {
    const apiKey = 'a9c904f412a04e12026c1921b4ca74d9649a61d2';
    const endpoint = `https://api.getgeoapi.com/v2/currency/convert?api_key=${apiKey}&from=USD&to=UYU&amount=${usdAmount}`;

    return fetch(endpoint)
        .then(apiToJson)
        .then(function (jsonResponse) {
            if (jsonResponse.status === "success") {
                return jsonResponse.rates.UYU.rate_for_amount;
            }
        });
}

function printTotalCartList(cartList) {
    let total = 0;
    const promises = [];

    for (const item of cartList) {
        const itemPrice = parseFloat(item.price) * item.amount;

        if (item.currency === "$") {
            total += itemPrice;
        } else if (item.currency === "U$S") {
            const promise = convertPrice(itemPrice);
            promises.push(promise);
        }
    }

    return Promise.all(promises)
        .then((convertedPrices) => {
            for (const convertedPrice of convertedPrices) {
                total += parseFloat(convertedPrice);
            }

            console.log('TotalCheck: ', total);
            const formattedTotal = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(total);
            return `Total: &nbsp<span>${formattedTotal}</span>`;
        })
        .catch((error) => {
            return null;
        });
}

function removeFromCartList(){
    document.querySelectorAll(".btn-trash").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const cardElement = event.target.closest("item-product");
            const id = cardElement.attributes.id.value;
            const index = cartList.findIndex((cartItem) => cartItem.id === id);
            if (index !== -1) {
                cartList.splice(index, 1);
                setLocalStorage("cartList", cartList);
            }
            printCartList(cartList)
        });
    });
}

function addUnitItem(){
    document.querySelectorAll(".select-unit").forEach((select) => {
        select.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    });
}
export function loadTabSearch(){
    // getProductList(3, ".home-content ion-scroll", false)
    $selectedFiltersGroup = document.querySelector(".selected-filters")
    
    getProductList(6, ".product-list", params, false)
    searchFilter();
    printAllFilters(params)
    $oneFilterValue = document.querySelectorAll(".filter-radio-group");
    $sortBy = document.querySelector(".filter-sort-by");
    hideSelectedFilters();
    handlerCloseModal();
    handlerClearModal();
    
}

function hideSelectedFilters(){
    $selectedFiltersGroup.innerHTML = ""
    $selectedFiltersGroup.classList.add("hidden");
}

function showSelectedFilters(){
    $selectedFiltersGroup = document.querySelector(".selected-filters")
    $selectedFiltersGroup.classList.remove("hidden");
}

function handlerCloseModal(){
    document.querySelectorAll(".btn-close-modal").forEach((element) => {
        element.addEventListener("click", closeModal)
    })

    const modalFilters = document.querySelector("#modal-filters")
    
function closeModal() {
    modalFilters.dismiss();
}
}

function handlerClearModal(){
    document.querySelector(".btn-clear-filters").addEventListener("click", clearFilters)

    const modalFilters = document.querySelector("#modal-filters")
    
    function clearFilters() {
        params = {
            official_store_id: STORE_ID,
        }

        $selectedFiltersGroup = document.querySelector(".selected-filters")
        $selectedFiltersGroup.innerHTML = ""
        $selectedFiltersGroup.classList.add("hidden");
        getProductList(6, ".product-list", params, false)
        printAllFilters(params)
    }
}

function searchFilter(){
    console.log('searchFilter: ', searchFilter);

    const $inpSearch = document.querySelector("#searchbar");
    console.log('$searchFilter: ', $inpSearch);
    $inpSearch.addEventListener('ionInput', (event) => {
        console.log('$searchFilter: ', event);
    const searchQuery = event.target.value;

    // if(searchQuery == ""){
    //     getProductList(6, ".product-list", params, false)
    // }
    
    console.log('searchQuery: ', searchQuery);
    params["offset"]= "0";
    params = {
        official_store_id: STORE_ID,
        q: searchQuery,
    }
    getProductList(6, ".product-list", params, false)
    printAllFilters(params);
    document.querySelector(".selected-filters").innerHTML = "";
    hideSelectedFilters();
});
}

function printAllFilters(params){

    fetchProducts(params)
    .then((apiJson)=>{
        
        document.querySelector(".all-filters").innerHTML = "";
        
        printSorts(apiJson);
        printFilters(apiJson, 'category');
        printFilters(apiJson, 'price');
        printFilters(apiJson, 'BRAND');
        printFilters(apiJson, 'ITEM_CONDITION');

        getDataForm();
        deleteFilter()
    })
}

function getDataForm(){
    $sortBy = document.querySelector(".filter-sort-by");

    $sortBy.addEventListener('ionChange', (event) => {
        if(event.target.value !== ''){
            params["sort"]= event.target.value;
        }
        params["offset"]= "0";
        printAllFilters(params)
        getProductList(6, ".product-list", params, false)
    });

    $oneFilterValue = document.querySelectorAll(".filter-radio-group");

    $oneFilterValue.forEach((group) => {
    group.addEventListener('ionChange', (event) => {
        if(event.target.value !== ''){
            params[event.target.getAttribute('data-id')]= event.target.value;
            // addToSelectedFilters(target)

            
            let selectedRadio = document.querySelector(`[data-id="${event.target.value}"]`).getAttribute('data-name');
            
            console.log("Selected RADIO", selectedRadio);
            console.log("SelectedFilters", event.target);
            console.log("SelectedFilters", event.target.getAttribute("data-id"));
            console.log("SelectedFilters", event.target.value);

            const filterType = event.target.getAttribute("data-id");
            showSelectedFilters()
            $selectedFiltersGroup.innerHTML +=
            `
            <ion-button type="button" class="button-selected-filter" data-type-filter="${filterType}" id="${event.target.value}" data-id=${event.target.value}><ion-icon name="close-outline"></ion-icon>${selectedRadio}</ion-button>
            `
        }
        printAllFilters(params)
        getProductList(6, "getProductList.product-list", params, false)
    });
})
}
function deleteFilter(){
    document.querySelectorAll(".button-selected-filter").forEach((group) => {
        group.addEventListener('click', (event) => {

            params["offset"]= "0";
            console.log("FILTER BUTTON", event.target.id);
            console.log("FILTER BUTTON",  document.getElementById(event.target.id));

            const selectedFilterButton = document.getElementById(event.target.id);
            const dataType = selectedFilterButton.getAttribute("data-type-filter");
            console.log('dataType: ', dataType);
            selectedFilterButton.remove();
            
            delete params[dataType];
            printAllFilters(params)
            getProductList(6, ".product-list", params, false)


            $selectedFiltersGroup = document.querySelector(".selected-filters");
            if($selectedFiltersGroup.childElementCount === 0){
                hideSelectedFilters();
            }
        })
    })
}

// function addToSelectedFilters(target){
//     console.log("SelectedFilters", target);
//     console.log("SelectedFilters", target.value);
//     console.log("SelectedFilters", target.getAttribute('data-id'));
//     // let html = `
//     //     <ion-button type="button" >${target.value}</ion-button>
//     // ` 
// }

function printFilters(apiJson, theFilter){
    const oneFilter = apiJson.available_filters.find(filter => filter.id === theFilter);
    if(oneFilter !== undefined){

        const arrayFilters = oneFilter.values
        let html = '';
        for(let element of arrayFilters){
            html +=
            `   
            <ion-radio value="${element.id}" data-id="${element.id}" data-name="${element.name}" aria-label="Custom checkbox that is checked"><ion-button type="button" fill="outline">${element.name}</ion-button></ion-radio>
            `;
        }
        document.querySelector(".all-filters").innerHTML += 
        `
            <ion-accordion value="${oneFilter.name}">
                <ion-item slot="header">
                    <ion-label><ion-title><h6>${oneFilter.name}</h6></ion-title></ion-label>
                </ion-item>
                <div class="ion-padding-horizontal" slot="content"> 
                    <ion-radio-group class="filter-radio-group" value="" id="opt-${oneFilter.id}" data-id="${oneFilter.id}" data-name="">
                        ${html}
                    </ion-radio-group></div>
            </ion-accordion>
        `
    }
}

function printSorts(apiJson){
    const sorts = apiJson.available_sorts;
    let html = '';
    for(let sortBy of sorts){
        html +=
        `   
        <ion-radio class="sortBy-item" value="${sortBy.id}" aria-label="Custom checkbox that is checked"><ion-button type="button" fill="outline">${sortBy.name}</ion-button></ion-radio>
        `;
    }
document.querySelector(".all-filters").innerHTML += 
    `
    <ion-accordion value="Ordenar por">
    <ion-item slot="header">
        <ion-label><ion-title><h6>Ordenar por</h6></ion-title></ion-label>
    </ion-item>
    <div class="ion-padding-horizontal" slot="content"> 
    <ion-radio-group value="${apiJson.sort.id}" id="sortBy" class="filter-sort-by">
    <ion-radio class="sortBy-item radio-checked" value="${apiJson.sort.id}" aria-label="Custom checkbox that is checked"><ion-button type="button" fill="outline">${apiJson.sort.name}</ion-button></ion-radio>
    ${html}
</ion-radio-group>
</div>
</ion-accordion>
    `
    const sortByItem = document.querySelector(".sortBy-item.radio-checked");
    sortByItem.querySelector('ion-button').setAttribute("fill", "solid");
}

export function loadMoreProducts(e){
    $.offsetPoint = $.offsetPoint + 50;
    params["offset"]= $.offsetPoint.toString();
    if($.offsetPoint < $.totalItems){
        printNextProducts(() => e.target.complete());
    } else {
        e.target.complete();
    }
}

function printNextProducts(onFinish){
    fetchProducts()
    .then((apiJson) => {
        getProductList(6, ".product-list", params, true);
        onFinish();
    });
}

function navTabSearch(){
    const $tabs = document.querySelector("ion-tabs");
    $tabs.select('search');
}

export function loadTabUser(){

}

function printUserInfo(user){
    const $userInfo = document.querySelector(".user-content");
    $userInfo.innerHTML =
    `
    <ion-title>
    <h5>Opciones de usuario</h5>
    </ion-title>
    <ion-subtitle>
    <h6>Bienvenido ${user.name}!</h6>
    </ion-subtitle>
    <div>
    <ion-item>
        <ion-label class="ion-padding-vertical">
            <strong>Nombre:</strong>
            ${user.name}
        </ion-label>
    </ion-item>
    <ion-item>
        <ion-label>
            <strong>Usuario:</strong>
            ${user.username}
        </ion-label>
    </ion-item>
    <ion-item>
        <ion-label>
            <strong>Email:</strong>
            ${user.email}
        </ion-label>
    </ion-item>
    </div>
    `
    if (user.additionalInfo.address !== undefined && user.additionalInfo.address !== "" ) {
        $userInfo.querySelector("div").innerHTML +=
        `
        <ion-item>
        <ion-label>
        <strong>Dirección:</strong>
        ${user.additionalInfo.address}
        </ion-label>
        </ion-item>
        `
    }
}

// function printcartList(cartList){
//     console.log("products", cartList)
//     let html= "";
//     for(let product of cartList){
//         html += 
//         `<ion-col size="6">
//             <card-product
//                 name="${product.name}"
//                 id="${product.id}"
//                 species="${product.species}"
//                 status="${product.status}"
//                 image="${product.image}"
//             ></card-product>
//         </ion-col>`;
//     }

//     document.querySelector(".product-list").innerHTML = 
//     `<ion-grid>
//         <ion-row>
//             ${html}
//         </ion-row>
//     </ion-grid>`
// }

// NAVEGATION -------------------------------------------------------------------------------

function navTabHome() {
    document.querySelector("ion-nav").setRoot("page-home");
}

// function navTabSearch() {
//     document.querySelector("ion-nav").push("page-search");
// }

// function navTabcart() {
//     document.querySelector("ion-nav").push("page-cart");
// }

// function navTabFav() {
//     document.querySelector("ion-nav").push("page-fav");
// }

export function navPageUserLogin() {
    document.querySelector("ion-nav").setRoot("page-user-login");
}

export function navPageUserSignup() {
    document.querySelector("ion-nav").setRoot("page-user-signup");
}

//------------------------------------------------------------------------

export function submitSignup(e){
    e.preventDefault();
    
    const signupData = {
        name: document.querySelector("#form-signup #inp-name").value,
        username: document.querySelector("#form-signup #inp-username").value,
        email: document.querySelector("#form-signup #inp-email").value,
        password: document.querySelector("#form-signup #inp-password").value,
        address: document.querySelector("#form-signup #inp-address").value,
    }

    //invalid data
    if (
        signupData.name === "" ||
        signupData.email === "" ||
        signupData.username === "" ||
        signupData.password === ""
        //VALIDATION PASSWORD
    ) {
        showToastError("Todos los campos son requeridos")
        return;
    }
    
    //valid data
    signUp(signupData);
}

function signUp(user){

    const dataToSend = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        additionalInfo: {
            address: user.address,
        },
    }

    fetch(USERS_URL + "/auth/signup",{
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        }, 
        body: JSON.stringify(dataToSend)
    })
    .then(apiToJson)
    .then((apiJson) => {
        if (apiJson.code === 201) {
            navPageUserLogin();
            showToastSuccess("Signup exitoso");
        } else {
            switch (apiJson.error) {
            case "DUPLICATED_USERNAME":
                showToastError("Ya existe un usuario con ese nombre de usuario")
                return;
                case "DUPLICATED_EMAIL":
                showToastError("Ya existe un usuario con ese email")
                return;
                default:
                showToastError("Signup falló debido a un error")
                break;
            }
        }
    })
    .catch((error) =>{
        showToastError("Signup falló debido a un error")
    })
}

export function submitLogin(e){
    e.preventDefault();
    
    const loginData = {
        email: document.querySelector("#form-login #inp-email").value,
        password: document.querySelector("#form-login #inp-password").value,
    }

    //invalid data
    if (
        loginData.email === "" ||
        loginData.password === ""
    ) {
        showToastError("Todos los campos son obligatorios")
        return;
    }
    
    //valid data
    logIn(loginData);
}

function logIn(user){
    fetch(USERS_URL + "/auth/signin",{
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        }, 
        body: JSON.stringify(user)
    })
    .then(apiToJson)
    .then((apiJson) => {
        if (apiJson.code === 200) {
            saveSession(apiJson.token, apiJson.user);
            navTabHome();
            showToastSuccess(`Bienvenido ${apiJson.user.name}!`);
        }  else {
            switch (apiJson.error) {
            case "USER_NOT_FOUND":
                showToastError("Usuario no encontrado");
                return;
                case "INVALID_PASSWORD":
                showToastError("Usuario o contraseña incorrectos")
                return;
                default:
                showToastError("Login falló debido a un error")
                break;
            }
        }
    })
    .catch((error) =>{
        showToastError("Login falló debido a un error")
    })
}

function saveSession(token, user) {
    status.userLogged = user;
    setLocalStorage("token", token);
}

export function sessionValidation(){
    const tokenUser = getLocalStorage("token")
    
    if(tokenUser === undefined){
        navPageUserLogin();
        showToastError("Debes ingresar para navegar");
    }
}

export function closeSession(){
    navPageUserLogin();
    localStorage.removeItem("token");
    status.userLogged = undefined;
    showToastError("Debes ingresar para navegar");
}

export function alertEraseUser(){
    const $alert = document.createElement("ion-alert");
    console.log($alert)
    
    $alert.header= "Estás por eliminar tu usuario";
    $alert.subHeader= "La contraseña es obligatoria";

    $alert.inputs = [
        {
            type: "password",
            name: "userPass",
            placeholder: "***",
        },
    ];
    
    $alert.buttons = [
        {
            text: "Eliminar",
            role: "destructive",
            color: "danger",
            cssClass: "custom-danger-button",
            handler: eraseUser,
        },
        "Cancelar",
    ];
    
    document.body.appendChild($alert);
    $alert.present();
}

export function eraseUser(args){

    const dataToSend = {
        password: args.userPass,
    };

    fetch(USERS_URL + "/user", {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "x-access-token": getLocalStorage("token"),
        },
        body: JSON.stringify(dataToSend),
    })
    .then(apiToJson)
    .then((apiJson) => {

        if (apiJson.code === 200) {
            closeSession();
            showToastSuccess("Usuario eliminado");
        } else {
            showToastError("Contraseña incorrecta");
        }
    });
}

export function alertEditUser(){
    const $alert = document.createElement("ion-alert");
    
    $alert.header= "Editar usuario";
    let addressLogged = "";
    if(status.userLogged.additionalInfo.address){
        addressLogged = status.userLogged.additionalInfo.address;
    }
    $alert.inputs = [
        {
            type: "text",
            name: "name",
            label:"Address",
            attributes: { label: "hola", "label-placement": "floating"},
            // "label-placement":"floating",
            cssClass: "floating-label",
            placeholder: "status.userLogged.name",
            value: status.userLogged.name
        },
        {
            label:"Address",
            type: "text",
            name: "address",
            placeholder: "address",
            value: addressLogged,
            cssClass: "floating-label",
        },
    ];
    
    $alert.buttons = [
        {
            text: "Editar",
            handler: editUser,
        },
        "Cancelar",
    ];
    
    document.body.appendChild($alert);
    $alert.present();
    // $alert.input.setAttribute("label-placement", "floating")
}


export function editUser(args){

    if(args.name === ""){
        showToastError("El nombre no puede ser vacío");
        alertEditUser();
    } else {
        const dataToSend = {
            name: args.name,
            additionalInfo: {
                address: args.address,
            }
        };

        fetch(USERS_URL + "/user", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "x-access-token": getLocalStorage("token"),
            },
            body: JSON.stringify(dataToSend),
        })
        .then(apiToJson)
        .then((apiJson) => {
            status.userLogged.additionalInfo.address = apiJson.user.additionalInfo.address

            if (apiJson.code === 200) {
                showToastSuccess("Usuario editado");
                printUserInfo(apiJson.user);
            } else {
                showToastError("Algo salió mal");
            }
        });
    }
}

function getUserInfo(){
    fetch(USERS_URL + "/user", {
        headers: {
            "x-access-token": getLocalStorage("token"),
        },
    })
    .then(apiToJson)
    .then((apiJson) => {

        if (apiJson.code === 404) {
            closeSession();
            showToastError("El usuario no existe");
        } else if (apiJson.code === 200) {
            printUserInfo(apiJson.user);
            status.userLogged = apiJson.user;
        } else {
            switch (apiJson.error) {
                case "TOKEN_EXPIRED":
                closeSession();
                navPageUserLogin();
                showToastError("Sesión caducada, por favor ingresa nuevamente")
                return;
                case "USER_NOT_FOUND":
                showToastError("Usuario no encontrado")
                return;
                default:
                showToastError("Signup falló debido a un error")
                break;
            }
        }
    });
}