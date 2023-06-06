import EditingFormView from '../view/editing-form.js';
import WayPointView from '../view/way-point.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  #changeData = null;
  #changeMode = null;
  #point = null;
  #mode = Mode.PREVIEW;

  constructor({pointListContainer, changeData, changeMode, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(point) {
    this.#point = point;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const prevPointComponent = this.#pointComponent;
    const prevEditingFormComponent =  this.#editFormComponent;

    this.#pointComponent = new WayPointView(point, this.#destinations, this.#offers);
    this.#editFormComponent = new EditingFormView({
      point: point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: false,
    });

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editFormComponent.setPointClickHandler(this.#handlePointClick);
    this.#editFormComponent.setSubmitHandler(this.#handleFormSubmit);
    this.#editFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (!prevPointComponent || !prevEditingFormComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    switch (this.#mode){
      case Mode.PREVIEW:
        replace(this.#pointComponent, prevPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#pointComponent, prevEditingFormComponent);
        this.#mode = Mode.PREVIEW;
        break;
    }

    remove(prevPointComponent);
    remove(prevEditingFormComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditingFormToPoint();
    }
  };

  #replacePointToEditingForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditingFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.PREVIEW;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePointToEditingForm();
  };

  #handlePointClick = () => {
    this.resetView();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.PREVIEW) {
      this.#editFormComponent.shake();
      return;
    }

    this.#editFormComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#editFormComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };
}
