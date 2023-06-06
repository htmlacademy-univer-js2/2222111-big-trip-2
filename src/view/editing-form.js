import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDateTime } from '../utils/date.js';
import { PointType, PointTypeDescription } from '../const';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 0,
  isFavorite: false,
  offers: [],
  type: PointType.TAXI,
};

const renderDestinationPictures = (pictures) => pictures.length === 0 ? '' :
  pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const renderOffers = (allOffers, checkedOffers, isDisabled) => allOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checkedOffers.includes(offer.id) ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

const renderOffersContainer = (allOffers, checkedOffers, isDisabled) => !allOffers || allOffers.offers.length === 0 ? '' :
  `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${renderOffers(allOffers.offers, checkedOffers, isDisabled)}
  </div>
  </section>`;

const renderDestinationNames = (destinations) => destinations.length === 0 ? '' :
  destinations.map((destination) => `<option value="${destination.name}"> </option>`).join('');

const renderDestinationContainer = (destination) => !destination ? '' :
  `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description ? destination.description : ''}</p>
  <div class="event__photos-container">
              <div class="event__photos-tape">
              ${renderDestinationPictures(destination.pictures)}
              </div>
            </div>
  </section>`;

const renderEditPointDateTemplate = (dateFrom, dateTo, isDisabled) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}"
    ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}"
    ${isDisabled ? 'disabled' : ''}>
  </div>`
);

const renderEditPointTypeTemplate = (currentType, isDisabled) => Object.values(PointType).map((type) =>
  `<div class="event__type-item">
     <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}
     ${isDisabled ? 'disabled' : ''}>
     <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${PointTypeDescription[type]}</label>
   </div>`).join('');

const renderResetButtonTemplate = (isNewPoint, isDisabled, isDeleting) => isNewPoint ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>` :
  `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
   <button class="event__rollup-btn" type="button">`;

const createEditingFormTemplate = (point, destinations, allOffers, isNewPoint) => {
  const {basePrice, type, destination, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting} = point;
  const allPointTypeOffers = allOffers.find((offer) => offer.type === type);
  const destinationData = destinations.find((item) => item.id === destination);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${renderEditPointTypeTemplate(type, isDisabled)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destination}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" value="${destinationData ? he.encode(destinationData.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${renderDestinationNames(destinations)}
          </datalist>
        </div>
        ${renderEditPointDateTemplate(dateFrom, dateTo, isDisabled)}
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}"  ${isDisabled ? 'disabled' : ''}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        ${renderResetButtonTemplate(isNewPoint, isDeleting)}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      ${renderOffersContainer(allPointTypeOffers, offers, isDisabled)}
      ${renderDestinationContainer(destinationData)}
        </section>
    </form>
  </li>`
  );
};

export default class EditingFormView extends AbstractStatefulView{

  #destinations = null;
  #offers = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = null;
  #offersByType = null;

  constructor({point = BLANK_POINT, destinations, offers, isNewPoint}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._state = EditingFormView.parsePointToState(point);
    this.#isNewPoint = isNewPoint;
    this.#offersByType = this.#offers.find((offer) => offer.type === this._state.type);
    this._restoreHandlers();
  }

  get template () {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
  }

  setPointClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#pointClickHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #pointClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt) =>{
    evt.preventDefault();
    this._callback.submit(EditingFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditingFormView.parseStateToPoint(this._state));
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) =>{
    this.updateElement(
      EditingFormView.parsePointToState(point),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #pointDateFromChangeHandler = ([userDate]) =>{
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #pointDateToChangeHandler = ([userDate]) =>{
    this.updateElement({
      dateTo: userDate,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.offers = [];
    this.updateElement({
      type: evt.target.value,
    });
  };

  #pointOffersChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOfferId = Number(evt.target.id.slice(-1));
    const offers = this._state.offers.filter((offer) => offer !== checkedOfferId);
    let currentOfferIds = [...this._state.offers];
    if (offers.length !== this._state.offers.length) {
      currentOfferIds = offers;
    }
    else {
      currentOfferIds.push(checkedOfferId);
    }
    this._setState({
      offers: currentOfferIds,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((des) => des.name === evt.target.value);
    this.updateElement({
      destination: destination.id,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#pointDestinationChangeHandler);
    if (this.#offersByType && this.#offersByType.offers.length > 0){
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersChangeHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  #setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#pointDateFromChangeHandler,
        },
      );
    }
  };

  #setDatepickerTo = () => {
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#pointDateToChangeHandler,
        },
      );
    }
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setPointClickHandler(this._callback.click);
    }
    this.setSubmitHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };


  static parsePointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}
