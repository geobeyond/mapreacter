import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Map from './components/map';

class Client {
  constructor(mapId, config = {}) {
    this.mapId = mapId;
    this._configureStore();
    if(config.basemap) {
      if(config.basemap === 'osm')
        this.addOsmBasemap();
    }
    if(config.sources && config.sources.length > 0) {
      config.sources.forEach( (source) => {
        this.addSource(source.id, source.source)
      })
    }
    if(config.layers && config.layers.length > 0) {
      config.layers.forEach( (layer) => {
        this.addLayer(layer)
      })
    }
    this.renderMap();
  }
  _configureStore() {
    this.store = createStore(combineReducers({
      map: SdkMapReducer,
    }), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
       applyMiddleware(thunkMiddleware));
  }
  renderMap() {
    ReactDOM.render((
      <MuiThemeProvider>
        <Provider store={this.store}>
          <Map />
        </Provider>
      </MuiThemeProvider>), document.getElementById(this.mapId)
    );

  }

  addOsmBasemap() {
    this.store.dispatch(mapActions.addSource('osm', {
      type: 'raster',
      tileSize: 256,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
    }));
    this.store.dispatch(mapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
  }
  addLayer(layer) {
    this.store.dispatch(mapActions.addLayer(layer));
  }
  addSource(sourceId, source) {
    this.store.dispatch(mapActions.addSource(sourceId,source));
  }
}
export default Client;
