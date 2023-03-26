import { render } from '../render.js';
import EditingFormView from '../view/editing-form.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import WayPointView from '../view/way-point.js';

export default class TripPresenter {
  constructor(container) {
    this.container = container;
    this.component = new TripListView();
  }

  init(pointsModel) {
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];

    render(new SortingView(), this.container);
    render(this.component, this.container);
    render(new EditingFormView(this.boardPoints[0], this.destinations, this.offers), this.component.getElement());

    for (const point of this.boardPoints){
      render(new WayPointView(point, this.destinations, this.offers), this.component.getElement());
    }
  }
}
