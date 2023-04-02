import { render } from '../render.js';
import EditingFormView from '../view/editing-form.js';
import SortingView from '../view/sorting.js';
import TripListView from '../view/trip-list.js';
import WayPointView from '../view/way-point.js';
import NoPointView from '../view/no-point.js';

export default class TripPresenter {

  #container = null;
  #component = null;
  #pointsModel = null;
  #boardPoints = null;
  #destinations = null;
  #offers = null;

  constructor(container) {
    this.#container = container;
    this.#component = new TripListView();
  }

  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    if(this.#boardPoints.length === 0){
      render(new NoPointView(), this.#container);
    }
    else{
      render(new SortingView(), this.#container);
      render(this.#component, this.#container);
      for(const point of this.#boardPoints){
        this.#renderTripPoint(point);
      }
    }
  }

  #renderTripPoint = (point) => {
    const pointComponent = new WayPointView(point, this.#destinations, this.#offers);
    const editingFormComponent = new EditingFormView(point, this.#destinations, this.#offers);

    const replaceComponents = (newComponent, oldComponent) => {
      this.#component.element.replaceChild(newComponent.element,oldComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc'){
        evt.preventDefault();
        replaceComponents(pointComponent, editingFormComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceComponents(editingFormComponent, pointComponent);
      document.addEventListener('keydown', onEscKeyDown);
    });

    editingFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceComponents(pointComponent, editingFormComponent);
      document.RemoveEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#component.element);

  };
}
