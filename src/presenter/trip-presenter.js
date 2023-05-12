import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../utils/sort.js';
import { sortPricePoint, sortDayPoint, sortTimePoint } from '../utils/date.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {

  #container = null;
  #component = null;
  #pointsModel = null;
  #boardPoints = null;

  #pointsPresenters = new Map();
  #currentSortType = null;
  #sourcedBoardPoints = [];

  #sortComponent = new SortingView();

  constructor(container) {
    this.#container = container;
    this.#component = new TripListView();
  }

  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    if(this.#boardPoints.length === 0){
      render(new NoPointView(), this.#container);
    }
    else{
      this.#renderSort();
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
    this.#sourcedBoardPoints = updateItem( this.#sourcedBoardPoints, updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoint(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderPoint = (point) =>{
    const pointPresenter = new PointPresenter(this.#component.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  };

  #renderPointList = (from, to) =>{
    this.#boardPoints.slice(from, to).forEach((point) => this.#renderPoint(point));
  };

  #renderSort = () =>{
    this.#boardPoints.sort(sortDayPoint);
    render(this.#sortComponent, this.#container);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearPointList = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  };

  #sortPoint = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortDayPoint);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortTimePoint);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPricePoint);
        break;
    }

    this.#currentSortType = sortType;
  };

}
