import { render, remove, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/editing-form.js';
import {nanoid} from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #editFormComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #pointsModel = null;
  #destinations = null;
  #offers = null;
  #isNewPoint = true;

  constructor(pointListContainer, changeData, pointsModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editFormComponent) {
      return;
    }
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#editFormComponent = new EditingFormView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });
    this.#editFormComponent.setSubmitHandler(this.#handleFormSubmit);
    this.#editFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#editFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editFormComponent);
    this.#editFormComponent = null;

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
