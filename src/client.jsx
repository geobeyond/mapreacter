import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { Router, Route, browserHistory } from 'react-router'
import { HashRouter, Switch, Route, Link } from 'react-router-dom'

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {createWMSLayer, createWMSSourceWithLayerName} from './services/wms/wmslayer'

import MapReducer from './reducers/map';
import * as configActions from './actions/map';
import Map from './components/map';

class Client {
  constructor(mapId, config = {}) {
    this.mapId = mapId;
    this.config = config;
    this._configureStore();
    if(config.basemap) {
      if(config.basemap === 'osm') {
        this.addOsmBasemap();
      } else if (config.basemap === 'mapbox') {
        this.addMapBoxBasemap();
      }
    }
    this.store.dispatch(configActions.setConfig(config));
    if(config.source && config.layers) {
      this._createLayers(config.source, config.layers);
    }
    this.renderMap();
  }
  _createLayers(sourceUrl, layers) {
    layers.forEach( (layerName, i, layers_) => {
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i;
      this.addSource(sourceId, source)
      this.addLayer(createWMSLayer(sourceId, layerName, layerName));
    });
  }
  _configureStore() {
    this.store = createStore(combineReducers({
      map: SdkMapReducer,
      local: MapReducer
    }), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
       applyMiddleware(thunkMiddleware));
  }
  renderMap() {
    ReactDOM.render((
      <MuiThemeProvider>
        <Provider store={this.store}>
          <HashRouter>
            <Switch>
              <Route path="/:viewparams+" render={(props) => (
                <Map {...props} />
              )}/>
              <Route exact path="/" component={Map} />
            </Switch>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>), document.getElementById(this.mapId)
    );

  }

  addMapBoxBasemap() {
    const baseUrl = `https://api.mapbox.com/styles/v1/mapbox/${this.config.mapbox.style}`;
    const mapboxUrl = `mapbox://${this.config.mapbox.style}`;
    const url = `http://api.mapbox.com/styles/v1/mapbox/${this.config.mapbox.style}?access_token=${this.config.mapbox.token}`;
    this.store.dispatch(mapActions.addSource('mapbox',{ type: 'vector', url: mapboxUrl}));
    this.store.dispatch(mapActions.addLayer({
      id: 'mapbox',
      source: 'mapbox',
    }));
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
module.exports = Client;
