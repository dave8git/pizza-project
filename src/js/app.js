import { settings, select, classNames } from './settings.js';
import Cart from './components/Cart.js';
import Product from './components/Product.js';

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.activatePage(thisApp.pages[0].id);

    thisApp.links = document.querySelector(select.nav.links);
  },
  activatePage: function (pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) { /* add class "active" to matching pages, remove from non-matching pages */
      // if(page.id == pageId) {
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      console.log(page);
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links, remove from non-matching links */
  },
  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    //console.log('testProduct:', testProduct);
  },
  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse:', parsedResponse);

        thisApp.data.products = parsedResponse; /* save parsedResponse as thisApp.data.products */

        thisApp.initMenu(); /* execute initMenu method */

      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));

  },
  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  init: function () {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
  },
};

app.init();
