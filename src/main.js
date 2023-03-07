import { render } from './render.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip-presenter.js';

const FILTER_CONTAINER = document.querySelector('.trip-controls__filters');
const TRIP_CONTAINER = document.querySelector('.trip-events');
const TRIP_PRESENTER = new TripPresenter({container : TRIP_CONTAINER});

render(new FiltersView(), FILTER_CONTAINER);
TRIP_PRESENTER.init();
