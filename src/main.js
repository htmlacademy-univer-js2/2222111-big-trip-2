import { render } from './framework/render.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { getPoints, getDestinations, getOffersByType } from './mock/point.js';

const siteHeaderElement = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const menuContainer = document.querySelector('.trip-controls__navigation');

const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();
const pointsModel = new PointsModel();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);

const tripPresenter = new TripPresenter(tripContainer, pointsModel, filterModel);

pointsModel.init(points, destinations, offersByType);
filterPresenter.init();
tripPresenter.init(pointsModel);

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, siteHeaderElement);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);


render(new MenuView(), menuContainer);
