import { render, remove, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/editing-form.js';
import {nanoid} from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #createPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({pointListContainer, changeData, pointsModel, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#createPointComponent) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#createPointComponent = new EditingFormView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#createPointComponent.setSubmitHandler(this.#handleFormSubmit);
    this.#createPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#createPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#createPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#createPointComponent);
    this.#createPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };
}
