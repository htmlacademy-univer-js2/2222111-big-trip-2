import TripInfoView from '../view/trip-info.js';
import { render, remove } from '../framework/render.js';


export default class TripInfoPresenter {

  #points = null;

  #destinations = null;
  #offers = null;

  #destinationsModel = null;
  #offersModel = null;

  #tripInfoContainer = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, destinationsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (points) => {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripInfoComponent = new TripInfoView(this.#points, this.#destinations, this.#offers);
    render(this.#tripInfoComponent, this.#tripInfoContainer);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };
}
