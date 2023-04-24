import EditingFormView from '../view/editing-form.js';
import WayPointView from '../view/way-point.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;
  #pointsModel = null;

  #destinations = null;
  #offers = null;

  #changeData = null;
  #changeMode = null;
  #point = null;
  #mode = Mode.PREVIEW;

  constructor(pointListContainer, pointsModel, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    const prevPointComponent = this.#pointComponent;
    const prevEditingFormComponent =  this.#editFormComponent;

    this.#pointComponent = new WayPointView(point, this.#destinations, this.#offers);
    this.#editFormComponent = new EditingFormView(point, this.#destinations, this.#offers);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editFormComponent.setPointClickHandler(this.#handlePointClick);
    this.#editFormComponent.setSubmitHandler(this.#handleFormSubmit);

    if (prevPointComponent === null || prevEditingFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.PREVIEW) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditingFormComponent);
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
      this.#replaceEditingFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditClick = () => {
    this.#replacePointToEditingForm();
  };

  #handlePointClick = () => {
    this.#replaceEditingFormToPoint();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditingFormToPoint();
  };
}
