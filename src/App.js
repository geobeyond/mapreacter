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
import SdkDrawingReducer from '@boundlessgeo/sdk/reducers/drawing';
import * as drawingActions from '@boundlessgeo/sdk/actions/drawing';
import { INTERACTIONS } from '@boundlessgeo/sdk/constants';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { MenuItem } from 'material-ui/Menu';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { cyan500, cyan700, pinkA200, grey300, grey400, grey500, white, darkBlack, fullBlack } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';

import { createWMSLayer, createWMSSourceWithLayerName } from './services/wms/wmslayer'
import { createVectorSourceFromStyle, createRasterSourceFromStyle } from './services/mapbox'
import MapReducer from './reducers/map';
import * as configActions from './actions/map';
import Map from './components/Map';
import TassonomiaReducer from './components/tassonomiaredux';
import TassonomiaAutoComplete from './components/TassonomiaAutoComplete';
import LayerListItem from './components/map/LayerListItem';
import { downloadFile } from './services/download';
import { mylocalizedstrings } from './services/localizedstring';
import RefreshIndicatorComponent from './components/RefreshIndicatorComponent';
import MeasureComponent from './components/MeasureComponent';

import './App.css';
//import {} from 'dotenv/config';
require('dotenv').config();

var axios = require('axios');

export const themiddleware = store => next => action => {
  switch (action.type) {
    case 'MAPINFO.SET_MOUSE_POSITION':
    case 'DRAWING_SET_MEASURE_FEATURE':
      break;
    case 'NEWDATASOURCE':
      console.log('themiddleware() current action:', action.type);
      break;
    default:
      console.log('themiddleware() current action:', JSON.stringify(action, (key, value) => {
        if (key === 'component') return '...';
        return value;
      }));
      break;
  }

  let result = next(action);

  switch (action.type) {
    case 'MAP_SET_VIEW':
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
        const thehash = '#/' + _array.join('/');
        console.log('themiddleware()', thehash);
        window.history.pushState(thehash, 'map', thehash);
      }
      break;

    case 'LOCAL.FITEXTENT':
      const _dataheader =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">\n' +
        '  <ows:Identifier>gs:Bounds</ows:Identifier>\n' +
        '  <wps:DataInputs>\n' +
        '    <wps:Input>\n' +
        '      <ows:Identifier>features</ows:Identifier>\n' +
        '      <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">\n' +
        '        <wps:Body>\n' +
        '          <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:nnb="nnb">\n' +
        '            <wfs:Query typeName="' + action.payload.layername + '">\n' +
        '              <ogc:Filter>\n';

      let _datafilter = '';
      //'                <ogc:PropertyIsEqualTo>\n' +
      //'                  <ogc:PropertyName>nome_scientifico</ogc:PropertyName>\n' +
      //'                  <ogc:Literal>91AA - Boschi orientali di quercia bianca</ogc:Literal>\n' +
      //'                </ogc:PropertyIsEqualTo>';

      const _datafooter =
        '              </ogc:Filter>\n' +
        '            </wfs:Query>\n' +
        '          </wfs:GetFeature>\n' +
        '        </wps:Body>\n' +
        '      </wps:Reference>\n' +
        '    </wps:Input>\n' +
        '  </wps:DataInputs>\n' +
        '  <wps:ResponseForm>\n' +
        '    <wps:RawDataOutput>\n' +
        '      <ows:Identifier>bounds</ows:Identifier>\n' +
        '    </wps:RawDataOutput>\n' +
        '  </wps:ResponseForm>\n' +
        '</wps:Execute>\n';

      const _array = store.getState().local.viewparams.split("/");
      store.getState().local.mapConfig.routing.forEach((record, index) => {
        if (_array[index] && _array[index] !== '*') {
          _datafilter +=
            '                <ogc:PropertyIsEqualTo>\n' +
            '                  <ogc:PropertyName>' + record.field + '</ogc:PropertyName>\n' +
            '                  <ogc:Literal>' + _array[index] + '</ogc:Literal>\n' +
            '                </ogc:PropertyIsEqualTo>\n';
        }
      });

      const _data = _dataheader + _datafilter + _datafooter;
      const url = store.getState().local.mapConfig.wpsserviceurl;
      store.dispatch(configActions.changerefreshindicator({ status: "loading" }));
      console.log("POST", url, _data);
      axios({
        method: 'post',
        url: url,
        headers: { 'content-type': 'text/xml' },
        data: _data
      })
        .then((response) => {
          console.log("response:", response.data);

          let dom = null;
          let lowercorner = null;
          let uppercorner = null;
          if (window.DOMParser) {
            dom = (new DOMParser()).parseFromString(response.data, "text/xml");
            dom.documentElement.childNodes.forEach((node) => {
              //console.log(node.nodeName, "=", node.firstChild.nodeValue);
              if (node.nodeName === 'ows:LowerCorner') {
                lowercorner = node.firstChild.nodeValue.split(" ");
              } else if (node.nodeName === 'ows:UpperCorner') {
                uppercorner = node.firstChild.nodeValue.split(" ");
              }
            });
            let _extent = [Number(lowercorner[0]), Number(lowercorner[1]), Number(uppercorner[0]), Number(uppercorner[1])];
            if (_extent[0] !== 0 && _extent[1] !== 0 && _extent[2] !== -1 && _extent[3] !== -1) {
              store.dispatch(mapActions.fitExtent(_extent, store.getState().mapinfo.size, "EPSG:4326"));
            }
          }
          store.dispatch(configActions.changerefreshindicator({ status: "hide" }));
        })
        .catch((error) => {
          console.error(error);
          store.dispatch(configActions.changerefreshindicator({ status: "hide" }));
        });
      break;

    case 'DRAWING_FINALIZE_MEASURE_FEATURE':
      store.dispatch(drawingActions.endDrawing());
      setTimeout(function () {
        console.log('timeout ...');
        store.dispatch(configActions.changeMeasureComponent({ open: false }));
      }, 2000);      
      break;

    default:
      break;
  }

  /*console.log('themiddleware() current state:', JSON.stringify(store.getState(), (key, value) => {
    if (key === 'component') return '...';
    return value;
  }));*/
  return result;
}

export const store = createStore(
  combineReducers({
    map: SdkMapReducer,
    mapinfo: SdkMapInfoReducer,
    print: SdkPrintReducer,
    drawing: SdkDrawingReducer,
    local: MapReducer,
    tassonomia: TassonomiaReducer,
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

  handleChangeLanguage = (event, index, value) => {
    mylocalizedstrings.setLanguage(value);
    this.setState({});
  };

  constructor(props) {
    super(props);
    console.log("App()");

    this.config = JSON.parse(process.env.REACT_APP_THECONFIG);
    this.config.wpsserviceurl = process.env.REACT_APP_WPSSERVICEURL;
    this.config.downloadCSVUrlParameters = process.env.REACT_APP_DOWNLOADCSVURLPARAMETERS;
    this.config.downloadShapefileUrlParameters = process.env.REACT_APP_DOWNLOADSHAPEFILEURLPARAMETERS;
    this.config.helpUrl = process.env.REACT_APP_HELPURL;
    this.config.helpDoc = process.env.REACT_APP_HELPDOC;

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
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ispraTheme)}>
          <Provider store={store}>
            <HashRouter>
              <div>
                <Dialog
                  title={mylocalizedstrings.sharetitle}
                  actions={[
                    <FlatButton
                      label={mylocalizedstrings.close}
                      primary={true}
                      onClick={() => { this.setState({ sharedialog: false }); }}
                    />,
                  ]}
                  modal={false}
                  open={this.state.sharedialog}
                  onRequestClose={() => { this.setState({ sharedialog: false }); }}
                >
                  {window.location.href}
                </Dialog>
                <RefreshIndicatorComponent/>
                <MeasureComponent />
                <Toolbar>
                  <ToolbarGroup firstChild={true} style={{ margin: '5px' }}>
                    <IconMenu
                      style={{ margin: '5px' }}
                      iconButtonElement={
                        <FontIcon className="material-icons">more_vert</FontIcon>
                      }
                    >
                      <MenuItem onClick={(event) => {
                        let url = this.config.helpUrl + mylocalizedstrings.getLanguage() + this.config.helpDoc;
                        let win = window.open(url, '_blank');
                        win.focus();
                      }} >
                        <i class="material-icons">help</i>
                      </MenuItem>

                      <MenuItem onClick={(event) => { this.setState({ sharedialog: true }); }} >
                        <i class="material-icons">share</i>
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
                              downloadFile(this.config.geoserverurl, this.config.layers, this.config.downloadCSVUrlParameters);
                            }}
                          />,
                          <MenuItem
                            primaryText="Shapefile"
                            onClick={(event) => {
                              downloadFile(this.config.geoserverurl, this.config.layers, this.config.downloadShapefileUrlParameters);
                            }}
                          />
                        ]}
                      >
                        <i class="material-icons">file_download</i>
                      </MenuItem>

                      <MenuItem
                        menuItems={[
                          <MenuItem
                            primaryText="Linea"
                            onClick={(event) => {
                              store.dispatch(drawingActions.startMeasure(INTERACTIONS.measure_line));
                              store.dispatch(configActions.changeMeasureComponent({ open: true }));
                            }}
                          />,
                          <MenuItem
                            primaryText="Poligono"
                            onClick={(event) => {
                              store.dispatch(drawingActions.startMeasure(INTERACTIONS.measure_polygon));
                              store.dispatch(configActions.changeMeasureComponent({ open: true }));
                            }}
                          />
                        ]}
                      >
                        <i class="material-icons">photo_size_select_small</i>
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
                  <ToolbarGroup firstChild={false} style={{ margin: '5px' }}>
                    <SelectField
                      floatingLabelText={mylocalizedstrings.selectLanguage}
                      value={mylocalizedstrings.getLanguage()}
                      onChange={this.handleChangeLanguage}
                      autoWidth={true}
                    >
                      <MenuItem value={'it'} primaryText="Italiano" />
                      <MenuItem value={'en'} primaryText="English" />
                    </SelectField>
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
