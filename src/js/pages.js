import {
  loadTabHome,
  loadTabDetail,
  loadTabCart,
  loadTabSearch,
  loadMoreProducts,
  loadTabUser,
  navPageUserSignup,
  navPageUserLogin,
  submitSignup,
  submitLogin,
  sessionValidation,
  closeSession,
  alertEraseUser,
  alertEditUser,
} from "./main.js"

customElements.define(
  "tab-home",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = /*html*/ `

      <ion-content class="ion-padding-horizontal" color="light">
      <div class="home-content">
      <div class="all-categories">
      <ion-title>
      <h5><ion-skeleton-text animated style="width: 50%; height: 24px;"></ion-skeleton-text></h5>
    </ion-title>
    <ion-grid>
      <ion-row>
        <ion-col size=4>
          <ion-card>
            <skeleton-product-categories></skeleton-product-categories>
          </ion-card>
        </ion-col>
        <ion-col size=4>
        <ion-card>
        <skeleton-product-categories></skeleton-product-categories>
        </ion-card>
        </ion-col>
        <ion-col size=4>
        <ion-card>
          <skeleton-product-categories></skeleton-product-categories>
        </ion-card>
      </ion-col>
        </ion-row>
    </ion-grid>
      </div>
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
      <div class="sale-list">
      <ion-title>
        <h5><ion-skeleton-text animated style="width: 50%; height: 24px;"></ion-skeleton-text></h5>
      </ion-title>
      <ion-card >
        <ion-list>
          <skeleton-product-itemlist></skeleton-product-itemlist>        
          <skeleton-product-itemlist></skeleton-product-itemlist>        
          <skeleton-product-itemlist></skeleton-product-itemlist>        
          <skeleton-product-itemlist></skeleton-product-itemlist>        
          <skeleton-product-itemlist></skeleton-product-itemlist>        
        </ion-list>
      </ion-card>
      </div>
      </div>
    </ion-content>
          `;

      loadTabHome()
          
      this.querySelector("ion-button").addEventListener("click", () => {
        document.querySelector("ion-nav#home-nav").push("page-detail");
      });
    }
  }
);

customElements.define(
  "tab-cart",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = /*html*/ `
        <ion-content class="ion-padding-horizontal cart-content" color="light">
        <div class="cart-list">
        <ion-grid>
        <ion-row>
        <ion-col size="6">
        <skeleton-product></skeleton-product>
        </ion-col>
        <ion-col size="6">
              <skeleton-product></skeleton-product>
            </ion-col>
            <ion-col size="6">
              <skeleton-product></skeleton-product>
            </ion-col>
            <ion-col size="6">
              <skeleton-product></skeleton-product>
            </ion-col>
            <ion-col size="6">
              <skeleton-product></skeleton-product>
            </ion-col>
            <ion-col size="6">
              <skeleton-product></skeleton-product>
            </ion-col>
          </ion-row>
          </ion-grid>
          </div>

        <div slot="fixed" color="light" class="ion-padding">
          <ion-text class="total-price text-end w-100 d-flex justify-content-end"></ion-text> 
          <ion-button class="ion-margin-top" expand="block">Ir a pagar</ion-button> 
        </div>
        </ion-content>
        `;
          loadTabCart()
    }
  }
);

customElements.define(
  "tab-search",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = /*html*/ `

      <ion-toolbar class="filters-row ion-padding-horizontal" color="light" slot="fixed" slot="end">
      <ion-row slot="end">
      <ion-text class="items-count"></ion-text>
      <ion-button id="open-modal-filters" fill="clear"><ion-icon name="options-outline"></ion-icon></ion-button>
      </ion-row>
      </ion-toolbar>
      <ion-content class="" color="light">
      <filters-modal></filters-modal>
      <div class="product-list">
      <ion-grid>
      <ion-row>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
      <ion-col size="6">
        <skeleton-product-swipercards></skeleton-product-swipercards>
      </ion-col>
        </ion-row>
        </ion-grid>
        </div>
        <ion-infinite-scroll>
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
        </ion-content>
      `;
      loadTabSearch()

      this.querySelector("ion-infinite-scroll").addEventListener(
        "ionInfinite", loadMoreProducts
      );

      
      document.querySelector(".btn-close-modal").addEventListener("click", closeModal)

  const modalFilters = document.querySelector("#modal-filters")
  
function closeModal(event) {
  event.preventDefault();
}
    }
  }
);

customElements.define(
  "tab-user",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = /*html*/ `
      <ion-content class="ion-padding-horizontal" color="light">
        <div class="user-content"></div>
        <ion-button fill="clear" id="btn-edit-user">Editar</ion-button>
        <ion-button expand="block" type="" id="btn-close-session">cerrar sesión</ion-button>
        <ion-button fill="clear" color="danger" id="btn-erase-user">eliminar usuario</ion-button>
      </ion-content>
      `;
        // <ion-card class="form">
        //   <ion-card-header>
        //     <ion-card-title><h2>Welcome</h2></ion-card-title>
        //     <ion-card-subtitle><h6>user name</h6></ion-card-subtitle>
        //   </ion-card-header>
        //   <ion-card-content>
        //     <ion-item>
        //       <ion-input id="inp-name" label="Name" label-placement="floating" placeholder="name value" value="user name"></ion-input>
        //     </ion-item>
        //     <ion-item>
        //       <ion-input id="inp-username" label="Username" label-placement="floating" placeholder="user value" value="user name"></ion-input>  
        //     </ion-item>
        //     <ion-item>
        //       <ion-input id="inp-email" label="Email" label-placement="floating" placeholder="test@mail.com" value="user name"></ion-input> 
        //     </ion-item>
        //   </ion-card-content>
        // </ion-card>
        
        loadTabUser();
        this.querySelector("#btn-close-session").addEventListener("click", closeSession);
        this.querySelector("#btn-erase-user").addEventListener("click", alertEraseUser);
        this.querySelector("#btn-edit-user").addEventListener("click", alertEditUser);
      }
  }
);

customElements.define(
  "page-home", 
  class extends HTMLElement{
    connectedCallback(){
      sessionValidation()

      this.innerHTML= document.getElementById("page-home.html").innerHTML;

      // $search.addEventListener("ionFocus", )
      navToTabSearch();

    }
  }
)
customElements.define(
  "page-detail", 
  class extends HTMLElement{
    connectedCallback(){

      this.innerHTML= document.getElementById("page-detail.html").innerHTML
      loadTabDetail(this.idProduct);
      const $searchDetail = document.querySelector("#searchbar-detail");
      const $search = document.querySelector("#searchbar");

      const $tabs = document.querySelector("ion-tabs");
  
      $searchDetail.addEventListener('ionFocus', function() {
          // Navega a la pestaña "search"
          document.querySelector("ion-nav").pop();
          $tabs.select('search');
          // document.querySelector("ion-nav#home-nav").pop("page-detail");

          // document.getElementById("page-detail.html");
          setTimeout(() => {
            $search.setFocus();
          }, 200);
      });
      $tabs.addEventListener("ionTabsDidChange", (ev) => {
        let searchValue = "";
        if (ev.detail.tab === "search") {
          $search.value = searchValue;
        } else {
          searchValue = $search.value;
          $search.value = "";
        }
      });
    }
  })

// customElements.define(
//   "page-cart", 
//   class extends HTMLElement{
//     connectedCallback(){

//       this.innerHTML= document.getElementById("page-cart.html").innerHTML
//       loadTabCart()
//     }
//   })

// customElements.define(
//     "page-search", 
//     class extends HTMLElement{
//     connectedCallback(){

//         this.innerHTML= document.getElementById("page-search.html").innerHTML

//     }
//   })

//   customElements.define(
//     "page-fav", 
//     class extends HTMLElement{
//     connectedCallback(){

//         this.innerHTML= document.getElementById("page-fav.html").innerHTML

//     }
//   })

customElements.define(
  "page-user-login", 
  class extends HTMLElement{
    connectedCallback(){

      this.innerHTML= document.getElementById("page-user-login.html").innerHTML

      this.querySelector("#form-login").addEventListener("submit", submitLogin);
      this.querySelector("#user-signup-button").addEventListener("click", navPageUserSignup);

    }
  })

customElements.define(
  "page-user-signup", 
  class extends HTMLElement{
    connectedCallback(){

      this.innerHTML= document.getElementById("page-user-signup.html").innerHTML

      this.querySelector("#form-signup").addEventListener("submit", submitSignup);
      this.querySelector("#user-login-button").addEventListener("click", navPageUserLogin);
    }
  })

  function navToTabSearch(){
    const $search = document.querySelector("#searchbar");
    const $tabs = document.querySelector("ion-tabs");

    $search.addEventListener('ionFocus', function() {
        // Navega a la pestaña "search"
        $tabs.select('search');
    });

    let searchValue = "";

    $tabs.addEventListener("ionTabsDidChange", (ev) => {
    
      if (ev.detail.tab === "search") {
        $search.value = searchValue;
        $search.focus();
      } else {
        searchValue = $search.value;
        $search.value = "";
      }
    });
  }