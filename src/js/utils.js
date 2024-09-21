export function apiToJson(rawRes){
    return rawRes.json();
}

export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function showToastSuccess(message) {
    console.log('showToastSuccess: ');
    showToast(message, "success");
}

export function showToastError(message) {
    console.log('showToastError: ');
    showToast(message, "danger");
}

export function buildUrl(url, params) {
    const urlObj = new URL(url);
    if (params !== undefined) {
        urlObj.search = new URLSearchParams(params).toString();
    }
    console.log("PARAMS" ,params)
    console.log("OBJ" ,urlObj)
    return urlObj;
}

export function createSwiper(insertAt, customSwiper){
    const swiper = new Swiper(`.swiper-${insertAt}`, {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // Pagination
        pagination: {
            el: '.swiper-pagination',
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        ...customSwiper
    });
    console.log(`SWIPER ${insertAt}`, swiper)
}

async function showToast(message, color) {
    const $toast = document.createElement("ion-toast");
    
    $toast.message = message;
    $toast.duration = 3000;
    $toast.color = color;
    
    document.body.appendChild($toast);
    $toast.present();
}

export function getShippingInfo(shipping) {
    switch (shipping.toLowerCase()) {
    case "true":
        return "success";
    case "false":
        return "danger";
    default:
        return "warning";
    }
}