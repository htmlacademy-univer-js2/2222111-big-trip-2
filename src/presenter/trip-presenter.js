import { render } from '../framework/render.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import NoPointView from '../view/no-point.js';
import { updateItem } from '../utils/common.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {

  #container = null;
  #component = null;
  #pointsModel = null;
  #boardPoints = null;

  #pointsPresenters = new Map();

  constructor(container) {
    this.#container = container;
    this.#component = new TripListView();
  }

  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];

    if(this.#boardPoints.length === 0){
      render(new NoPointView(), this.#container);
    }
    else{
      render(new SortingView(), this.#container);
      render(this.#component, this.#container);
      this.#renderPointList(0, this.#boardPoints.length);
    }
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) =>{
    const pointPresenter = new PointPresenter(this.#component.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  };

  #renderPointList = (from, to) =>{
    this.#boardPoints.slice(from, to).forEach((point) => this.#renderPoint(point));
  };

  #clearPointList = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  };

}
