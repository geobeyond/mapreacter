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

export const store = createStore(
  combineReducers({
    map: SdkMapReducer,
    mapinfo: SdkMapInfoReducer,
    print: SdkPrintReducer,
    local: MapReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware));


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

  constructor(props) {
    super(props);
    console.log("App()", JSON.stringify(process.env));

    console.log("window.config=", window.config);

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
    if (this.config.map && this.config.map.center) {
      let zoom = this.config.map.zoom || 2;
      store.dispatch(mapActions.setView(this.config.map.center, zoom));
    }
  }

  componentDidMount() {
    console.log("App.componentDidMount()");
  }

  render() {
    console.log("App.render()");
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ispraTheme)}>
          <Provider store={store}>
            <HashRouter>
              <div>
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
