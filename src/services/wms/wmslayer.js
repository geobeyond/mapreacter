export const createWMSSourceWithLayerName = (url, name, options = {tileSize: 256}) => {
  return {
      type: 'raster',
      tileSize: options.tileSize,
      tiles: [`${url}&LAYERS=${name}`],
  }
}
export const createWMSSource = (url, options = {tileSize: 256}) => {
  return {
      type: 'raster',
      tileSize: options.tileSize,
      tiles: [url],
  }
}
export const createWMSLayer = (sourceId, id, title, group, description = '', options = { queryable: true }) => {
  return {
    metadata: {
      'mapbox:group': group,
      'bnd:title': title,
      'bnd:queryable': options.queryable,
    },
    id: id,
    source: sourceId,
    description: description 
  }
}
