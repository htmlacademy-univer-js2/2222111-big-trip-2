import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;
  #isSuccessfullLoading = false;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
      this.#isSuccessfullLoading = true;
    } catch(err) {
      this.#destinations = [];
      this.#isSuccessfullLoading = false;
    }
  };

  get destinations() {
    return this.#destinations;
  }

  get isSuccessfullLoading() {
    return this.#isSuccessfullLoading;
  }
}
