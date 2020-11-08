import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWdget();
    thisProduct.processOrder();
    //console.log('new Product:', thisProduct);
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
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
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
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form); /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    thisProduct.params = {};
    let price = thisProduct.data.price; /* set variable price to equal thisProduct.data.price */

    for (let paramId in thisProduct.data.params) {
      /* START LOOP: for each paramId in thisProduct.data.params */
      const param = thisProduct.data.params[paramId]; /* save the element in thisProduct.data.params with key paramId as const param */
      for (let optionId in param.options) {
        /* START LOOP: for each optionId in param.options */
        const option = param.options[optionId]; /* save the element in param.options with key optionId as const option */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        const activeImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        if (optionSelected && !option.default) {
          /* START IF: if option is selected and option is not default */
          price += option.price;
          //price += thisProduct.amountWidget.value === 1 ? option.price : option.price * thisProduct.amountWidget.value; /* add price of option to variable price */
        } else if (!optionSelected && option.default) {
          /* END IF: if option is selected and option is not default */
          /* START ELSE IF: if option is not selected and option is default */
          price -= option.price;
          //price -= thisProduct.amountWidget.value === 1 ? option.price : option.price * thisProduct.amountWidget.value; /* deduct price of option from price */
        }
        if (optionSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[option.id] = option.label;

          for (let activeImage of activeImages) {
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for (let activeImage of activeImages) {
            activeImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

        /* END ELSE IF: if option is not selected and option is default */
      }
      /* END LOOP: for each optionId in param.options */
    }

    /* END LOOP: for each paramId in thisProduct.data.params */


    /* multiply price by amount */
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price; /* set the contents of thisProduct.priceElem to be the value of variable price */
  }
  initAmountWdget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem, thisProduct.data.price);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });

  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
