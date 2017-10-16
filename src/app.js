import {createWMSLayer, createWMSSource} from './components/map/wms/wmslayer'
import Client from './client'

let layer = { Name: 'ne:ne', Title: 'Test'};
let source = createWMSSource(`https://demo.boundlessgeo.com/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:900913&LAYERS=${layer.Name}&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`);
let mapLayer = createWMSLayer(layer.Name,layer.Name, layer.Title, { queryable: true});

let config = {
  basemap: 'osm',
  sources: [{id: layer.Name, source}],
  layers: [mapLayer]
}
let client = new Client('map', config);
