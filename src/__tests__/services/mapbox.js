
import * as mapbox from '../../services/mapbox';

describe('#createRasterSourceFromStyle', () => {
  it('returns mapboxgl source object of type raster', () => {
    const style = 'satellite';
    const token = 'test';
    const expected = { 
      attribution: '<a href="http://mapbox.com">MapBox</a> | <a href="http://mapbox.com/tos">Terms of Service</a>',
      type: 'raster',
      tileSize: 256,
      tiles: [
        `https://a.tiles.mapbox.com/v4/${style}/{z}/{x}/{y}.png?access_token=${token}`,
        `https://b.tiles.mapbox.com/v4/${style}/{z}/{x}/{y}.png?access_token=${token}`,
        `https://c.tiles.mapbox.com/v4/${style}/{z}/{x}/{y}.png?access_token=${token}`
      ]
    };
    expect(mapbox.createRasterSourceFromStyle(style, token)).toEqual(expected);
  });
});
describe('#createVectorSourceFromStyle', () => {
  it('returns mapboxgl source object of type vector', () => {
    const style = 'satellite';
    const token = 'test';
    const url = `mapbox://${style}`;
    const expected = { type: 'vector', url };
    expect(mapbox.createVectorSourceFromStyle(style)).toEqual(expected);
  });
});
