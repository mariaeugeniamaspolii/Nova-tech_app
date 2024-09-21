import {
    shareLink,
    changeSelectedAmount
} from "./main.js"

customElements.define("card-product", class extends HTMLElement{
    connectedCallback(){

        const id = this.attributes.id ? this.attributes.id.value : "";
        const name = this.attributes.name.value;
        const price = this.attributes.price.value;
        // const sold = this.attributes.sold.value;
        const currency = this.attributes.currency.value;
        const shipping = this.attributes.shipping.value;
        const image = this.attributes.image.value;
        
        let hasShipping = "";
        if(shipping === "true"){
            hasShipping = createShippingBadge(shipping);
            console.log('hasShipping T: ', hasShipping);
        }

        const btnAttr = id ? "button" : "";
        const soldQuantity = this.attributes.sold ? this.attributes.sold.value : "";

        this.innerHTML = document.getElementById("card-product.html").innerHTML;
        this.innerHTML = `
        <ion-card class="card-product" ${btnAttr}>
        <img
        alt=""
        src="${image}"
        />
        <ion-text>${soldQuantity}</ion-text>
        <ion-card-header>
        <ion-card-subtitle>${name}</ion-card-subtitle>
        <ion-card-title>${currency} ${price} </ion-card-title>
        ${hasShipping}
        </ion-card-header>
            </ion-card>
    `;

        this.querySelector(".card-product").addEventListener("click", () =>{
            document.querySelector("ion-nav").push("page-detail", {
                idProduct: id
            });
        });
    }
});

customElements.define("card-product-detail", class extends HTMLElement{
    connectedCallback(){

        const id = this.attributes.id.value;
        const name = this.attributes.name.value;
        const price = this.attributes.price.value;
        const currency = this.attributes.currency.value;
        const brand = this.attributes.brand.value;
        const description = this.attributes.description.value;
        const shipping = this.attributes.shipping.value;
        const stock = this.attributes.stock.value;
        const amount = parseInt(this.attributes.amount.value);

        const encodedImagesJson = this.attributes.images.value;
        const imagesJson = decodeURIComponent(encodedImagesJson);
        // console.log('this.attributes.images: ', this.attributes.images.split(','));

        const images = JSON.parse(imagesJson);
        this.innerHTML = document.getElementById("card-product-detail.html").innerHTML;

        const hasShipping = createShippingBadge(shipping);

        // console.log('images: ', images);

        let imagesSliders = ""
        for(let image of images){

        imagesSliders +=
        `
        <div class="swiper-slide">
                        <img src="${image.secure_url}">
                    </div>
        `
        }
        this.innerHTML = `

        <ion-card class="card-product-detail">
            <ion-card-header>
                <ion-card-subtitle>${name}</ion-card-subtitle>
                <ion-text class="text-uppercase">Disponibles: ${stock}</ion-text>
            </ion-card-header>
            
            <!-- Slider main container -->
            <div class="swiper swiper-detail">
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper">
                <!-- Slides -->
                ${imagesSliders}
                </div>
                <!-- Pagination -->
                <div class="swiper-pagination"></div>
            </div>
            <ion-card-body>
            <ion-row>
            <ion-col size="8">
            <ion-card-title>${currency} ${price} </ion-card-title>
            <ion-card-subtitle>${brand} </ion-card-subtitle>
            </ion-col>
            <ion-col size="4">
            <ion-button data-id-cart="${id}" color="primary" class="inverted-color btn-add-cart"><ion-icon name="cart-outline"></ion-icon></ion-button>
            <ion-button data-id-share="${id}" color="primary" class="inverted-color btn-share-link"><ion-icon name="share-social-outline"></ion-icon></ion-button>
            </ion-col>
            </ion-row>
            ${hasShipping}
            <ion-button expand="block" class="btn-buy ion-margin-vertical">Comprar</ion-button>
            <ion-row>
            <ion-text><span>Descripción:</span></ion-text><br>
            <ion-text>${description}</ion-text>
            </ion-row>
            </ion-card-body>
            </ion-card>
            `;
            
        }
});

customElements.define("item-product", class extends HTMLElement{
    connectedCallback(){

        const id = this.attributes.id ? this.attributes.id.value : "";
        const name = this.attributes.name.value;
        const price = this.attributes.price.value;
        // const sold = this.attributes.sold.value;
        const currency = this.attributes.currency.value;
        const shipping = this.attributes.shipping.value;
        const image = this.attributes.image.value;
        const item = this.attributes.listItem.value;
        const stock = this.attributes.stock.value;
        let amount = this.attributes.amount.value;

        let hasShipping;
        if(shipping === "true"){
            hasShipping = createShippingBadge(shipping);
            console.log('hasShipping T: ', hasShipping);
        }

        const btnAttr = id ? "button" : "";
        const soldQuantity = this.attributes.sold ? this.attributes.sold.value : "";

        this.innerHTML = document.getElementById("item-product.html").innerHTML;
        
        if(item === "true"){
            console.log('stock: ', stock);

            this.innerHTML = `

            <ion-item class="card-product">
            <ion-thumbnail slot="start">
                <img alt="" src="${image}" />
            </ion-thumbnail>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-note>${name}</ion-note>
                    </ion-col>
                    <ion-col size="3">
                        <ion-button class="btn-trash" fill="clear" class="toaster" size="small">
                            <ion-icon name="trash-outline"></ion-icon>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4"  
                    style=" padding-bottom: 0;">
                        <ion-item  (click)="$event.stopPropagation()" style="
                        border-radius: 4px;
                        height: 80%;
                        object-fit: center;
                        align-items: center;
                        display: flex;
                        width: fit-content;" color="light">
                            <ion-select value="${amount}" id="selecItem-${id}" class="select-unit" [interfaceOptions]="customPopoverOptions" interface="popover" placeholder="1 u">
                                <ion-select-option disabled color="light" style="height: 60px; 
                                pointer-events: none; 
                                color: #555; background-color: #000; 
                                font-size: 14px; 
                                font-weight: bold;" 
                                class="popover-title">Disponibles: ${stock}</ion-select-option>
                                <ion-select-option ${stock < 1 ? 'disabled' : ''} value="1">1 u</ion-select-option>
                                <ion-select-option ${stock < 2 ? 'disabled' : ''} value="2">2 u</ion-select-option>
                                <ion-select-option ${stock < 3 ? 'disabled' : ''} value="3">3 u</ion-select-option>
                                <ion-select-option ${stock < 4 ? 'disabled' : ''} value="4">4 u</ion-select-option>
                                <ion-select-option ${stock < 5 ? 'disabled' : ''} value="5">5 u</ion-select-option>
                                <ion-select-option ${stock < 6 ? 'disabled' : ''} value="">Más de 5 unidades</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-col>
                    <ion-col class="cart-item-price text-end">
                        <ion-label>${currency} ${parseFloat(price)*amount}</ion-label>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>  
        `
        let selectedItem = document.querySelector(`#selecItem-${id}`);
        console.log('selectedItem: ', selectedItem);
        selectedItem.addEventListener('ionChange', (event) => {
            amount = selectedItem.value;
            changeSelectedAmount(id, selectedItem, amount)
        });

        //   <ion-buttons>
        //     <ion-button size="small">
        //       <ion-icon name="remove-outline"></ion-icon>
        //     </ion-button>
        //     <ion-input value="1" fill="solid" input placeholder="Enter text"></ion-input>
        //     <ion-button size="small">
        //       <ion-icon name="add-outline"></ion-icon>
        //     </ion-button>
        //   </ion-buttons>
        } else {
            this.innerHTML = `

        <ion-item class="card-product">
            <ion-thumbnail slot="start">
                <img alt="" src="${image}" />
            </ion-thumbnail>
            <div class="row">
                <ion-note>${name}</ion-note>
                <ion-label>${currency} ${price}</ion-label>
                ${hasShipping}
            </div>
        </ion-item>
        `
        }
        // <ion-card>
        //     <ion-row>
        //         <ion-col size="3">
        //             <img alt="" src="${image}"/>
        //         </ion-col>
        //         <ion-col size="9">
        //             <ion-note>${name}</ion-note>
        //             <ion-label>${currency} ${price}</ion-label>
        //         </ion-col>
        //     </ion-row>
        // </ion-card>
        this.querySelector(".card-product").addEventListener("click", () =>{
            document.querySelector("ion-nav").push("page-detail", {
                idProduct: id
            });
        });
    }
});

customElements.define("main-header", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("main-header.html").innerHTML;
    }
});

customElements.define("skeleton-product", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("skeleton-product.html").innerHTML;
    }
});

customElements.define("skeleton-product-categories", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("skeleton-product-categories.html").innerHTML;
    }
});

customElements.define("skeleton-product-swipercards", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("skeleton-product-swipercards.html").innerHTML;
    }
});

customElements.define("skeleton-product-itemlist", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("skeleton-product-itemlist.html").innerHTML;
    }
});


customElements.define("filters-modal", class extends HTMLElement{
    connectedCallback(){
        this.innerHTML = document.getElementById("filters-modal.html").innerHTML;
        this.innerHTML = `
            
            <ion-modal trigger="open-modal-filters" id="modal-filters" initial-breakpoint="0.90">
                <ion-header>
                    <ion-toolbar color="light">
                        <ion-buttons slot="start" class="toolbar-buttons">
                            <ion-button class="btn-close-modal"><ion-icon name="close-outline"></ion-icon></ion-button>
                        </ion-buttons>
                        <ion-title class="toolbar-title">Filtros</ion-title>
                        <ion-buttons slot="end" class="toolbar-buttons">
                            <ion-button class="btn-clear-filters">Limpiar</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding-horizontal">
                    <form id="form-filters">
                        <ion-list>
                            <ion-item class="selected-filters"></ion-item>
                            <ion-accordion-group multiple="true" class="all-filters">
                            </ion-accordion-group> 
                        </ion-list>
                        <div slot="fixed" class="ion-padding">
                        <ion-button expand="block" id="btn-form-filter" class="btn-close-modal">
                        Ver &nbsp;<ion-text class="items-count"></ion-text>
                        </ion-button>
                        </div> 
                    </form>
                </ion-content>
            </ion-modal>


        `

    }
});

function createShippingBadge(shipping) {
    let hasShipping = '';
    if (shipping === "true") {
        hasShipping = `<ion-badge class="inverted-color" color="success">Envio gratis</ion-badge>`;
    } else {
        hasShipping = `<ion-badge class="inverted-color" color="dark">Retiro en local</ion-badge>`;
    }
    return hasShipping;
}