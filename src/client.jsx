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
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import SdkPrintReducer from '@boundlessgeo/sdk/reducers/print';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { Menu, MenuItem } from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Download from 'material-ui/svg-icons/file/file-download';

import { createWMSLayer, createWMSSourceWithLayerName } from './services/wms/wmslayer'
import { createVectorSourceFromStyle, createRasterSourceFromStyle } from './services/mapbox'

import MapReducer from './reducers/map';
import * as configActions from './actions/map';
import Map from './components/map';
import TassonomiaAutoComplete from './components/TassonomiaAutoComplete';
import LayerListItem from './components/map/layerlistitem';
import { downloadCSV } from './download';

export const store = createStore(
  combineReducers({
    map: SdkMapReducer,
    print: SdkPrintReducer,
    local: MapReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware));

class Client {
  constructor(mapId, config = {}) {
    this.mapId = mapId;
    this.config = config;
    if (config.basemaps) {
      config.basemaps.reverse().forEach((basemap) => {
        this._addBasemap(basemap, config[basemap]);
      })
    }
    store.dispatch(configActions.setConfig(config));
    if (config.source && config.layers) {
      this._createLayers(config.source, config.layers);
    }
    this.renderMap();
    if (this.config.map && this.config.map.center) {
      let zoom = this.config.map.zoom || 2;
      store.dispatch(mapActions.setView(this.config.map.center, zoom));
    }
  }
  _addBasemap(basemap, basemapConfig = {}) {
    if (basemap === 'osm') {
      this.addOsmBasemap();
    } else if (basemap === 'mapbox' && basemapConfig.style) {
      this.addMapBoxBasemap();
    }
  }
  _createLayers(sourceUrl, layers) {
    layers.forEach((layerName, i, layers_) => {
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i;
      this.addSource(sourceId, source)
      this.addLayer(createWMSLayer(sourceId, layerName, layerName));
    });
  }
  renderMap() {
    console.log("client.renderMap()");
    ReactDOM.render((
      <MuiThemeProvider>
        <Provider store={store}>
          <HashRouter>
            <div>
              <Toolbar>
                <ToolbarGroup firstChild={true} >
                  <IconMenu iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  >
                    <MenuItem onClick={(event) => { console.log("finestra modale"); }}>
                      <IconButton>
                        <FontIcon className="material-icons">help</FontIcon>
                      </IconButton>
                    </MenuItem>

                    <MenuItem
                      primaryText="Download"
                      leftIcon={<Download />}
                      menuItems={[
                        <MenuItem primaryText="PNG" onClick={(event) => {
                          store.dispatch(printActions.exportMapImage());
                        }} />,
                        <MenuItem primaryText="CSV" onClick={(event) => {
                          downloadCSV(this.config.geoserverurl, this.config.layers);
                        }} />,
                      ]}
                    />

                    <SdkLayerList style={{ margin: 0 }} className='layer-list' layerClass={LayerListItem} />
                  </IconMenu>
                  <TassonomiaAutoComplete url={this.config.tassonomiaserviceurl} />
                </ToolbarGroup>
              </Toolbar>
              <Switch>
                <Route path="/:viewparams+" render={(props) => (
                  <Map {...props} />
                )} />
                <Route exact path="/" component={Map} />
              </Switch>
              <Toolbar className="footer">
                <ToolbarGroup>
                  <ToolbarTitle text="footer ..." />
                </ToolbarGroup>
              </Toolbar>
            </div>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>), document.getElementById(this.mapId)
    );
  }

  addMapBoxBasemap() {
    let source;
    switch (this.config.mapbox.type) {
      case 'raster':
        source = createRasterSourceFromStyle(this.config.mapbox.style, this.config.mapbox.token);
        break;
      default:
        source = createVectorSourceFromStyle(this.config.mapbox.style);
    }
    store.dispatch(mapActions.addSource('mapbox', source));
    store.dispatch(mapActions.addLayer({
      id: 'mapbox',
      source: 'mapbox',
    }));
  }
  addOsmBasemap() {
    store.dispatch(mapActions.addSource('osm', {
      type: 'raster',
      tileSize: 256,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
    }));
    store.dispatch(mapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
  }
  addLayer(layer) {
    store.dispatch(mapActions.addLayer(layer));
  }
  addSource(sourceId, source) {
    store.dispatch(mapActions.addSource(sourceId, source));
  }
}
module.exports = Client;
