import { render, remove, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/editing-form.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #createPointComponent = null;

  #changeData = null;
  #destroyCallback = null;

  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
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
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#createPointComponent.setSubmitHandler(this.#handleFormSubmit);
    this.#createPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#createPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (!this.#createPointComponent) {
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
      point,
    );
  };

  setSaving = () => {
    this.#createPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this.#createPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#createPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };
}
