import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #offers = [];
  #offersApiService = null;
  #isSuccessfullLoading = false;

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
      this.#isSuccessfullLoading = true;
    } catch(err) {
      this.#offers = [];
      this.#isSuccessfullLoading = false;
    }
  };

  get offers() {
    return this.#offers;
  }

  get isSuccessfullLoading() {
    return this.#isSuccessfullLoading;
  }
}
