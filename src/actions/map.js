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
        let paramEscaped = param.replace(",", "\\,").replace(";", "\\;");
        viewparams.push(local.mapConfig.viewparams[i] + ':' + paramEscaped);
      }
    });

    local.mapConfig.layers.forEach((layerName, i, layers) => {
      let sourceUrl = encodeURI(local.mapConfig.source + '&viewparams=' + viewparams.join(';'));
      console.log("map.updateLayersWithViewparams()", layerName, sourceUrl);
      let source = createWMSSourceWithLayerName(sourceUrl, layerName);
      const sourceId = 'source_' + i + local.mapConfig.viewparams[0] + (Math.floor(Math.random() * 1000) + 1);
      dispatch(mapActions.addSource(sourceId, source));
      dispatch(mapActions.updateLayer(layerName, createWMSLayer(sourceId, layerName, layerName)));
      dispatch(mapActions.orderLayer(layerName));
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
  const _viewparams = viewparams.replace(/^#\//g, "");
  return {
    type: 'SET_VIEWPARAMS',
    payload: {
      viewparams: _viewparams
    }
  };
}

export const fitextent = (layername) => {
  return {
    type: 'LOCAL.FITEXTENT',
    payload: {
      layername: layername
    }
  };
}

export const changerefreshindicator = (refreshIndicator) => {
  return {
    type: 'LOCAL.CHANGEREFRESHINDICATOR',
    payload: {
      refreshIndicator: refreshIndicator
    }
  };
}

export const changeMeasureComponent = (measureComponent) => {
  return {
    type: 'LOCAL.CHANGEMEASURECOMPONENT',
    payload: {
      measureComponent: measureComponent
    }
  };
}

export const changeFeatureInfoComponent = (featureInfoComponent) => {
  return {
    type: 'LOCAL.CHANGEFEATUREINFOCOMPONENT',
    payload: {
      featureInfoComponent: featureInfoComponent
    }
  };
}
