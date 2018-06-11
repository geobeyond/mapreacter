import * as mapActions from '@boundlessgeo/sdk/actions/map';
import { createWMSLayer, createWMSSourceWithLayerName } from '../services/wms/wmslayer'

export const viewparams = [];


export const updateLayersWithViewparams = (params) => {
  console.log("map.updateLayersWithViewparams()", params);
  return function (dispatch, getState) {
    const { local } = getState();

    viewparams.length = 0;
    /*params.forEach((param, i) => {
      if (param !== '*') {
        let paramEscaped = param.replace(",", "\\,").replace(";", "\\;");
        viewparams.push(local.mapConfig.viewparams[i] + ':' + paramEscaped);
      }
    });*/

    let counter = 0;
    for (let i = 0; i < 4; i++) {
      if (params[i]) {
        if (params[i] !== '*') {
          let paramEscaped = params[i].replace(",", "\\,").replace(";", "\\;");
          if (local.mapConfig.viewparams[i]) {
            viewparams.push(local.mapConfig.viewparams[i] + ':' + paramEscaped);
            counter++;
          }
        }
      }
    }
    if (counter === 0) {
      let _item = local.mapConfig.viewparams[0] + ':none';
      console.log("map.updateLayersWithViewparams() aggiungo ", _item);
      viewparams.push(_item);
    }

    counter = 0;
    for (let i = 4; i < 8; i++) {
      if (params[i]) {
        if (params[i] !== '*') {
          let paramEscaped = params[i].replace(",", "\\,").replace(";", "\\;");
          if (local.mapConfig.viewparams[i]) {
            viewparams.push(local.mapConfig.viewparams[i] + ':' + paramEscaped);
            counter++;
          }
        }
      }
    }
    if (counter === 0) {
      let _item = local.mapConfig.viewparams[4] + ':none';
      console.log("map.updateLayersWithViewparams() aggiungo ", _item);
      viewparams.push(_item);
    }

    let filter='';
    if (local.regProvComponent['filter']) {
      filter=local.regProvComponent['filter'];
      console.log("map.updateLayersWithViewparams()", filter);
    }    
    local.mapConfig.layers.forEach((rec, i) => {
      let sourceUrl = encodeURI(local.mapConfig.source + '&viewparams=' + viewparams.join(';')+filter);
      console.log("map.updateLayersWithViewparams()", rec.name, sourceUrl);
      let source = createWMSSourceWithLayerName(sourceUrl, rec.name);
      const sourceId = 'source_' + i + local.mapConfig.viewparams[0] + (Math.floor(Math.random() * 1000) + 1);
      dispatch(mapActions.addSource(sourceId, source));
      dispatch(mapActions.updateLayer(rec.name, createWMSLayer(sourceId, rec.name, rec.name, rec.group, rec.description)));
      dispatch(mapActions.orderLayer(rec.name));
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

export const changeRegProvComponent = (regProvComponent) => {
  return {
    type: 'LOCAL.CHANGEREGPROVCOMPONENT',
    payload: {
      regProvComponent: regProvComponent
    }
  };
}
