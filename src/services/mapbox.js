/** 
const baseUrl = `https://api.mapbox.com/styles/v1/mapbox/${this.config.mapbox.style}`;
const mapboxUrl = `mapbox://${this.config.mapbox.style}`;
const url = `http://api.mapbox.com/styles/v1/mapbox/${this.config.mapbox.style}?access_token=${this.config.mapbox.token}`;
const mapboxTileUrl = `https://a.tiles.mapbox.com/v4/${this.config.mapbox.style}/{z}/{x}/{y}.png?access_token=${this.config.mapbox.token}`;
**/

export const createRasterSourceFromStyle = (style, token) => {
  let urls = ['a','b','c'].map(function (i) { return `https://${i}.tiles.mapbox.com/v4/${style}/{z}/{x}/{y}.png?access_token=${token}`;});
  return {type: 'raster',
      tileSize: 256,
      tiles: urls,
      attribution: '<a href="http://mapbox.com">MapBox</a> | <a href="http://mapbox.com/tos">Terms of Service</a>',
  }
}
export const createVectorSourceFromStyle = (style) => {
  const url = `mapbox://${style}`;
  return { type: 'vector', url };
}
