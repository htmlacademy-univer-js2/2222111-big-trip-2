import { render } from '../framework/render.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class NewPointButtonPresenter {
  #tripPresenter = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #newPointButtonContainer = null;
  #newPointButtonComponent = null;

  constructor({newPointButtonContainer, destinationsModel, offersModel, pointsModel, tripPresenter}) {
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#tripPresenter = tripPresenter;
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView();
  }

  renderNewPointButton = () => {
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    if (this.#offersModel.offers.length === 0 || this.#offersModel.isSuccessfullLoading === false ||
      this.#destinationsModel.destinations.length === 0 || this.#destinationsModel.isSuccessfullLoading === false ||
      this.#pointsModel.isSuccessfullLoading === false) {
      this.#newPointButtonComponent.element.disabled = true;
    }
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#tripPresenter.createPoint(this.#handleNewPointFormClose);
    this.#newPointButtonComponent.element.disabled = true;
  };
}
