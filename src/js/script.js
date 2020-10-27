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

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      // console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data); /* generate HTML based on template */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); /* create element using utils.createElementFromHTML */
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element); /* add element to menu */
    }
    getElements() {
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }
    initAccordion() {
      const thisProduct = this;

      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); /* find the clickable trigger (the element that should react to clicking) */
      clickableTrigger.addEventListener('click', function (event) {
        /* START: click event listener to trigger */
        event.preventDefault(); /* prevent default action for event */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive); /* toggle active class on element of thisProduct */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive); /* find all active products */
        for (let activeProduct of activeProducts) {
          /* START LOOP: for each active product */
          if (activeProduct != thisProduct.element) {
            /* START: if the active product isn't the element of thisProduct */
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive); /* remove class active for the active product */
          } /* END: if the active product isn't the element of thisProduct */
        } /* END LOOP: for each active product */
      }); /* END: click event listener to trigger */
    }
    initOrderForm() {
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      console.log('initOrderForm');
    }
    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);  /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      let price = thisProduct.data.price;/* set variable price to equal thisProduct.data.price */
        for (let paramId in thisProduct.data.params) { /* START LOOP: for each paramId in thisProduct.data.params */
          const param = thisProduct.data.params[paramId]; /* save the element in thisProduct.data.params with key paramId as const param */
          for (let optionId in param.options) { /* START LOOP: for each optionId in param.options */
            const option = param.options[optionId];/* save the element in param.options with key optionId as const option */
            const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
            if(optionSelected && !option.default) {/* START IF: if option is selected and option is not default */
              price += option.price;/* add price of option to variable price */
            } else if (!optionSelected && option.default) {/* END IF: if option is selected and option is not default *//* START ELSE IF: if option is not selected and option is default */
              price -= option.price;/* deduct price of option from price */
            }
            /* END ELSE IF: if option is not selected and option is default */
          }
          /* END LOOP: for each optionId in param.options */
        }
        /* END LOOP: for each paramId in thisProduct.data.params */

        thisProduct.priceElem.innerHTML = price; /* set the contents of thisProduct.priceElem to be the value of variable price */

      console.log('formData', formData);
      console.log('processOrder');
    }
  }

  const app = {
    initMenu: function () {
      //const testProduct = new Product(); //
      //console.log('testProduct:', testProduct);
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    init: function () {
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
