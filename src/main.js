import { render } from './framework/render.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import { getPoints, getDestinations, getOffersByType } from './mock/point.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(tripContainer);

const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();
const pointsModel = new PointsModel();

render(new FiltersView(), filterContainer);

pointsModel.init(points, destinations, offersByType);
tripPresenter.init(pointsModel);
