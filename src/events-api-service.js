import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const apiEndpoints = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const IS_NEW_EVENT = true;

export default class EventsApiService extends ApiService {
  get userEvents () {
    return this._load({url: apiEndpoints.POINTS})
      .then(ApiService.parseResponse);
  }

  get destinations () {
    return this._load({url: apiEndpoints.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  get offers () {
    return this._load({url: apiEndpoints.OFFERS})
      .then(ApiService.parseResponse);
  }

  async updateEvent (event) {
    const response = await this._load({
      url: `${apiEndpoints.POINTS}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: apiEndpoints.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event, IS_NEW_EVENT)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteEvent(event) {
    const response = await this._load({
      url: `${apiEndpoints.POINTS}/${event.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(event, isNewEvent) {
    const dateFrom = new Date(event.dateFrom);
    const dateTo = new Date(event.dateTo);
    const offers = [...event.offers]
      .filter(([, offer]) => offer.isActive)
      .map(([id]) => id);

    return {
      ...(isNewEvent ? {} : { 'id': event.id }),
      'base_price': parseFloat(event.basePrice),
      'date_from': dateFrom instanceof Date && !isNaN(dateFrom) ? dateFrom.toISOString() : null,
      'date_to': dateTo instanceof Date && !isNaN(dateTo) ? dateTo.toISOString() : null,
      'destination': event.destination.id,
      'is_favorite': event.isFavorite,
      'offers': offers,
      'type': event.type
    };
  }

}
