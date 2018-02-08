/**
import {createWMSLayer, createWMSSource} from './services/wms/wmslayer'
import Client from './client'

let layer = { Name: 'ne:ne', Title: 'Test'};
let source = createWMSSource(`https://demo.boundlessgeo.com/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:900913&LAYERS=${layer.Name}&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`);
let mapLayer = createWMSLayer(layer.Name,layer.Name, layer.Title, { queryable: true});

let source_1 = createWMSSource('http://193.206.192.107/geoserver/nnb/wms?service=WMS&version=1.1.0&request=GetMap&layers=ispra:param_oss_point&viewparams=nome_scientifico:Stachys%20officinalis%20(L.)%20Trevis.&srs=EPSG:4326&format=image/png&transparent=true');
let mapLayer_1 = createWMSLayer('beyond', 'oss', 'oss', { queryable: true});
**/
var config = {
	basemap: 'mapbox',
  mapbox: {
    //style: 'mapbox.mapbox-satellite-v9',
    style: 'mapbox.mapbox-streets-v6',
    token: 'pk.eyJ1IjoibWlsYWZyZXJpY2hzIiwiYSI6ImNqOHk3YXJibTFwbTkycW9iM2JkMGVzbnEifQ.TKtR_oqVfT3bR7kEAPxK7w',
  },
	viewparams: ['nome_scientifico', 'test'],
  //source: 'https://demo.boundlessgeo.com/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:900913&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
  source: 'http://ogsuite.geobeyond.it/geoserver/nnb/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true',
  //layers: ['ne:ne']
	layers: ['nnb:param_oss_point'],
	//source: 'http://193.206.192.107/geoserver/nnb/wms?service=WMS&version=1.1.0&request=GetMap&format=image/png&transparent=true'
};
var client = new Client('map', config);
