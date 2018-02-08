import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import Client from '../src/client';


describe('Client', () => {
  beforeEach(() => {
    let div = document.createElement('div');
    document.body.appendChild(div)
    div.setAttribute('id', 'map');
    let controls = document.createElement('div');
    controls.setAttribute('id', 'controls');
    document.body.appendChild(controls)
  })
  it('initiates an instance', () => {
    let config = {
      "basemaps": ["mapbox", "osm"],
      "mapbox": { "type": "raster", "style": "mapbox.satellite", "token": "pk.eyJ1IjoibWlsYWZyZXJpY2hzIiwiYSI6ImNqOHk3YXJibTFwbTkycW9iM2JkMGVzbnEifQ.TKtR_oqVfT3bR7kEAPxK7w" }, 
      "map": { "center": [12, 42], "zoom": 6 }, 
      "viewparams": ["phylum", "famiglia", "nome_scientifico"], 
      "source": "http://localhost:8080/geoserver/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true", 
      "layers": ["nnb:param_oss_point", "nnb:param_oss_polig"], 
      "tassonomiaserviceurl": "http://localhost:8080/MyRestServer/tassonomia?name=", 
      "geoserverurl": "http://localhost:8080/geoserver"
    };
    let client = new Client('map', config);
    expect(client).toBeInstanceOf(Client);
  });
});
