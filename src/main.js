import { render } from './framework/render.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsApiService from './api-service/points-api-service.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';

const AUTHORIZATION = 'Basic oVenIls2023pwvt4';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const menuContainer = document.querySelector('.trip-controls__navigation');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  pointsModel: pointsModel,
  filterModel: filterModel
});
filterPresenter.init();

const tripPresenter = new TripPresenter({
  tripContainer: tripContainer,
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});
tripPresenter.init(pointsModel);

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(newPointButtonComponent, siteHeaderElement);
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});

render(new MenuView(), menuContainer);
