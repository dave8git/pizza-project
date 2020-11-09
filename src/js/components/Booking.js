import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';
class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidget();
  }
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget(); /* generate HTML based on template */
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML)); /* "zawartość wrappera zamieniać na kod HTML wygenrowany z szablonu" - create element using utils.createElementFromHTML */
    console.log(thisBooking.dom.wrapper);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom.peopleAmount);
    //menuContainer.appendChild(thisProduct.element); /* add element to menu */

  }
  initWidget() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;
