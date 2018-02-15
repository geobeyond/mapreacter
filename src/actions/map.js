import * as mapActions from '@boundlessgeo/sdk/actions/map';
import { createWMSLayer, createWMSSourceWithLayerName } from '../services/wms/wmslayer'

export const viewparams = [];

export const changeOrAddViewParamsToUrl = (url, viewparams) => {
  console.log("map.changeOrAddViewParamsToUrl()", url, viewparams);
  if (url.search('viewparams') > 0) {
    return url.replace(/(viewparams=).*?(&|$)/, '$1' + viewparams + '$2');
  }
  return url + '&viewparams=' + viewparams;
}

export const updateLayersWithViewparams = (params) => {
  console.log("map.updateLayersWithViewparams()", params);
  return function (dispatch, getState) {
    const { local } = getState();

    viewparams.length = 0;
    params.forEach((param, i) => {
      if (param !== '*') {
        viewparams.push(local.mapConfig.viewparams[i] + ':' + param);
      }
    });

    local.mapConfig.layers.forEach((layerName, i, layers) => {
      let sourceUrl = encodeURI(local.mapConfig.source + '&viewparams=' + viewparams.join(';'));
      console.log("map.updateLayersWithViewparams()", layerName, sourceUrl);
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i + local.mapConfig.viewparams[0] + (Math.floor(Math.random() * 1000) + 1);
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

export const setViewParams = (viewparams) => {
  return {
    type: 'SET_VIEWPARAMS',
    payload: {
      viewparams: viewparams
    }
  };
}
