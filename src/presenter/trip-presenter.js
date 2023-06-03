import { render, remove, RenderPosition } from '../framework/render.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import LoadingView from '../view/loading.js';
import { sorting } from '../utils/sort.js';
import { filter } from '../utils/filters.js';
import { UpdateType, UserAction, SortType, FilterType } from '../const.js';

export default class TripPresenter {

  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #noPointComponent = null;
  #sortComponent = null;
  #pointListComponent = new TripListView();
  #loadingComponent = new LoadingView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #pointNewPresenter = null;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({tripContainer, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointNewPresenter = new PointNewPresenter({
      pointListContainer: this.#pointListComponent.element,
      changeData: this.#handleViewAction,
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    sorting[this.#currentSortType](filteredPoints);
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const pointCount = this.points.length;
    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderPointList(this.points);
    this.#renderSort();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#noPointComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      changeData: this.#handleViewAction,
      changeMode: this.#handleModeChange,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = (points) => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(points);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}
