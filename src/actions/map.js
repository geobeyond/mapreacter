import * as mapActions from '@boundlessgeo/sdk/actions/map';
import {createWMSLayer, createWMSSourceWithLayerName} from '../services/wms/wmslayer'

export const changeOrAddViewParamsToUrl = (url, viewparams) => {
  if(url.search('viewparams') > 0) {
    return url.replace(/(viewparams=).*?(&|$)/,'$1' + viewparams + '$2');
  }
  return url + '&viewparams=' + viewparams;
}

export const updateLayersWithViewparams = (params) => {
  return function (dispatch, getState) {
    const { local } = getState();
    let viewparams = params.map( (param, i) => {
      return local.mapConfig.viewparams[i] + ':' + param;
    })
    local.mapConfig.layers.forEach( (layerName, i, layers) => {
      let sourceUrl = local.mapConfig.source + '&viewparams=' + viewparams.join(';');
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i + local.mapConfig.viewparams[0]  + (Math.floor(Math.random() * 1000) + 1);
      dispatch(mapActions.addSource(sourceId, source));
      dispatch(mapActions.updateLayer(layerName, createWMSLayer(sourceId, layerName, layerName)))
    })
  }
}

export const setConfig = (config) => {
  return {
      type: 'SET_CONFIG',
      config
    };
}
