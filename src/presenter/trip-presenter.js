import { render } from '../render.js';
import CreatingFormView from '../view/creating-form.js';
import EditingFormView from '../view/editing-form.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import WayPointView from '../view/way-point.js';

export default class TripPresenter{
  constructor({container}){
    this.container = container;
    this.component = new TripListView();
  }

  init(){
    render(new SortingView(), this.container);
    render(this.component, this.container);
    render(new EditingFormView(), this.component.getElement());
    render(new CreatingFormView(), this.component.getElement());
    for (let i = 0; i < 3; i++){
      render(new WayPointView(), this.component.getElement());
    }
  }
}

