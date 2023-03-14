import { render } from './render.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({container : tripContainer});

render(new FiltersView(), filterContainer);
tripPresenter.init();
