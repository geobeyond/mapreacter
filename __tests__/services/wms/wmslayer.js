
import * as wms from '../../../src/services/wms/wmslayer'

describe('#createWMSSource', () => {
  it('returns a Mapbox GL source definition', () => {
    let url = 'http://demo.geonode.org/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&format=image/png&transparent=true';
    let expected = { type: 'raster', tileSize: 256, tiles: [url]};
    expect(wms.createWMSSource(url)).toEqual(expected);
  })
});
