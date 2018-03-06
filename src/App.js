import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import SdkPrintReducer from '@boundlessgeo/sdk/reducers/print';
import SdkMapInfoReducer from '@boundlessgeo/sdk/reducers/mapinfo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { MenuItem } from 'material-ui/Menu';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Download from 'material-ui/svg-icons/file/file-download';
import { cyan500, cyan700, pinkA200, grey300, grey400, grey500, white, darkBlack, fullBlack } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { createWMSLayer, createWMSSourceWithLayerName } from './services/wms/wmslayer'
import { createVectorSourceFromStyle, createRasterSourceFromStyle } from './services/mapbox'
import MapReducer from './reducers/map';
import * as configActions from './actions/map';
import Map from './components/Map';
import TassonomiaAutoComplete from './components/TassonomiaAutoComplete';
import LayerListItem from './components/map/LayerListItem';
import { downloadCSV, downloadShapefile } from './download';
import './App.css';
//import {} from 'dotenv/config';
require('dotenv').config();

export const themiddleware = store => next => action => {
  if (action.type !== 'MAPINFO.SET_MOUSE_POSITION') {
    console.log('themiddleware() current action:', JSON.stringify(action, (key, value) => {
      if (key === 'component') return '...';
      return value;
    }));
  }

  let result = next(action);

  if (action.type === 'MAP_SET_VIEW') {
    if (store.getState().local['viewparams']) {
      const _index = store.getState().local.mapConfig.routing.length;
      const _array = store.getState().local.viewparams.split("/");
      while (_array.length < (_index + 4)) {
        _array.push('*');
      }

      _array[_index] = store.getState().map.zoom;
      _array[_index + 1] = '' + Math.round(store.getState().map.center[0] * 100) / 100;
      _array[_index + 2] = '' + Math.round(store.getState().map.center[1] * 100) / 100;
      _array[_index + 3] = store.getState().map.bearing;
      const thehash = '/#/' + _array.join('/');
      console.log('themiddleware()', thehash);
      window.history.pushState(thehash, 'map', thehash);
    }
  }

  /*console.log('themiddleware() current state:', JSON.stringify(store.getState(), (key, value) => {
    if (key === 'component') return '...';
    return value;
  })); */
  return result;
}

export const store = createStore(
  combineReducers({
    map: SdkMapReducer,
    mapinfo: SdkMapInfoReducer,
    print: SdkPrintReducer,
    local: MapReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(themiddleware, thunkMiddleware));


const ispraTheme = {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: '#00601d', //grey100,
    accent3Color: grey500,
    textColor: white, //darkBlack,
    alternateTextColor: white,
    canvasColor: '#00601d', //white,
    borderColor: grey300,
    disabledColor: fade(white, 0.3), //fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};

class App extends Component {

  config = {};
  state = {
    sharedialog: false,
  };
  handleOpenShareDialog = () => {
    this.setState({ sharedialog: true });
  };

  handleCloseShareDialog = () => {
    this.setState({ sharedialog: false });
  };

  constructor(props) {
    super(props);
    console.log("App()");

    //console.log("window.config=", window.config);

    this.config = JSON.parse(process.env.REACT_APP_THECONFIG);
    store.dispatch(configActions.setConfig(this.config));

    store.dispatch(mapActions.updateMetadata({
      'mapbox:groups': {
        base: {
          name: 'Base Maps',
        },
      },
    }));

    // Background layers change the background color of
    // the map. They are not attached to a source.
    store.dispatch(mapActions.addLayer({
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#eee',
      },
      metadata: {
        'bnd:hide-layerlist': true,
      },
    }));

    if (this.config.basemaps) {
      this.config.basemaps.reverse().forEach((basemap) => {
        this._addBasemap(basemap, this.config[basemap]);
      })
    }

    if (this.config.source && this.config.layers) {
      this._createLayers(this.config.source, this.config.layers);
    }

    const _array = window.location.hash.split("/");
    if (_array.length === 8) {
      const _map = {
        center: [Number(_array[5]), Number(_array[6])],
        zoom: Number(_array[4])
      };
      store.dispatch(mapActions.setView(_map.center, _map.zoom));
    } else if (this.config.map && this.config.map.center) {
      let zoom = this.config.map.zoom || 2;
      store.dispatch(mapActions.setView(this.config.map.center, zoom));
    }
  }

  componentDidMount() {
    console.log("App.componentDidMount()");
  }

  render() {
    console.log("App.render()");
    const actions = [
      <FlatButton
        label="Chiudi"
        primary={true}
        onClick={this.handleCloseShareDialog}
      />,
    ];
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ispraTheme)}>
          <Provider store={store}>
            <HashRouter>
              <div>
                <Dialog
                  title="per confividere la pagina copia ed invia questo link:"
                  actions={actions}
                  modal={false}
                  open={this.state.sharedialog}
                  onRequestClose={this.handleCloseShareDialog}
                >
                  {window.location.href}
                </Dialog>
                <Toolbar>
                  <ToolbarGroup firstChild={true} style={{ margin: '5px' }}>
                    <IconMenu
                      style={{ margin: '5px' }}
                      iconButtonElement={
                        <FontIcon className="material-icons">more_vert</FontIcon>
                      }
                    >
                      <MenuItem onClick={(event) => { console.log("finestra modale"); }} >
                        <IconButton>
                          <FontIcon className="material-icons">help</FontIcon>
                        </IconButton>
                      </MenuItem>

                      <MenuItem onClick={(event) => { this.handleOpenShareDialog(); }} >
                        <IconButton>
                          <FontIcon className="material-icons">share</FontIcon>
                        </IconButton>
                      </MenuItem>

                      <MenuItem
                        menuItems={[
                          <MenuItem
                            primaryText="PNG"
                            onClick={(event) => {
                              store.dispatch(printActions.exportMapImage());
                            }}
                          />,
                          <MenuItem
                            primaryText="CSV"
                            onClick={(event) => {
                              downloadCSV(this.config.geoserverurl, this.config.layers);
                            }}
                          />,
                          <MenuItem
                            primaryText="Shapefile"
                            onClick={(event) => {
                              downloadShapefile(this.config.geoserverurl, this.config.layers);
                            }}
                          />
                        ]}
                      >
                        <IconButton>
                          <Download />
                        </IconButton>
                      </MenuItem>
                    </IconMenu>
                    <IconMenu
                      style={{ margin: '5px' }}
                      iconButtonElement={
                        <IconButton>
                          <FontIcon className="material-icons">folder_open</FontIcon>
                        </IconButton>
                      }
                    >
                      <div className="sdk-layerlist">
                        <SdkLayerList layerClass={LayerListItem} />
                      </div>
                    </IconMenu>
                    <TassonomiaAutoComplete config={this.config} style={{ margin: '5px' }} />
                  </ToolbarGroup>
                </Toolbar>
                <Switch>
                  <Route path="/:viewparams+" render={(props) => (
                    <Map {...props} />
                  )} />
                  <Route exact path="/" component={Map} />
                </Switch>
              </div>
            </HashRouter>
          </Provider>
        </MuiThemeProvider>
      </div>
    );
  }


  _addBasemap(basemap, basemapConfig = {}) {
    console.log("_addBasemap()", basemap, basemapConfig);
    if (basemap === 'osm') {
      this.addOsmBasemap();
    } else if (basemap === 'mapbox' && basemapConfig.style) {
      this.addMapBoxBasemap();
    }
  }
  _createLayers(sourceUrl, layers) {
    console.log("_createLayers()", sourceUrl, layers);
    layers.forEach((layerName, i, layers_) => {
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i;
      store.dispatch(mapActions.addSource(sourceId, source));
      store.dispatch(mapActions.addLayer(createWMSLayer(sourceId, layerName, layerName)));
    });
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
      metadata: {
        'mapbox:group': 'base',
        'bnd:title': 'mapbox',
      },
      type: 'raster',
      /*layout: {
          visibility: 'none',
      }, */
      id: 'mapbox',
      source: 'mapbox',
    }));
  }
  addOsmBasemap() {
    // add the OSM source
    store.dispatch(mapActions.addOsmSource('osm'));

    // and an OSM layer.
    // Raster layers need not have any paint styles.
    store.dispatch(mapActions.addLayer({
      id: 'osm',
      source: 'osm',
      type: 'raster',
      metadata: {
        'mapbox:group': 'base'
      }
    }));
  }
}

export default App;
