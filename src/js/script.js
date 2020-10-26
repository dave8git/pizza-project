/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data); /* generate HTML based on template */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); /* create element using utils.createElementFromHTML */
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element); /* add element to menu */
      console.log('menuContainer', menuContainer);
      console.log('generatedHTML', generatedHTML);
    }
    initAccordion(){
      const thisProduct = this;

      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);/* find the clickable trigger (the element that should react to clicking) */
      clickableTrigger.addEventListener('click', function(event){ /* START: click event listener to trigger */
        event.preventDefault(); /* prevent default action for event */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);/* toggle active class on element of thisProduct */
        console.log('clickable', select.menuProduct.clickable);
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive); /* find all active products */
        for (let activeProduct of activeProducts) {/* START LOOP: for each active product */
          console.log('jestem');
          if (activeProduct != thisProduct.element) { /* START: if the active product isn't the element of thisProduct */

            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);/* remove class active for the active product */

        }/* END: if the active product isn't the element of thisProduct */

        }/* END LOOP: for each active product */

      });/* END: click event listener to trigger */
    }

  }

  const app = {
    initMenu: function() {
      const testProduct = new Product(); //

      //console.log('testProduct:', testProduct);
    },
    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
