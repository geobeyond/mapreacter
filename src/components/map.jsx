import React from 'react';
import PropTypes from 'prop-types';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper';
import {List} from 'material-ui/List';

import WMSPopup from './map/wms/wmspopup'
import LayerListItem from './map/layerlistitem'
import ZoomControl from './map/zoom-control';
import {createWMSLayer, createWMSSource} from '../services/wms/wmslayer'

import * as actions from '../actions/map';

export class Map extends React.Component {
  componentDidMount() {
    if(this.props.viewparams) {
      this.updateLayer(this.props.viewparams);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.viewparams !== this.props.viewparams) {
      this.updateLayer(nextProps.viewparams);
    }
  }
  updateLayer(viewparams) {
    console.log("Map.updateLayer()", viewparams);
    this.props.updateLayersWithViewparams(viewparams.split("/"))
  }
  render() {
    console.log("Map.render()");
    let token = this.props.mapConfig.basemap === 'mapbox' ? this.props.mapConfig.mapbox.token : '';
    let layerListStyle = {
      margin: 0
    }
    return(
      <div className="client-map">
        <SdkMap
          style={{position: 'relative'}}
          accessToken={token}
          includeFeaturesOnClick
          onClick={(map, xy, featuresPromise) => {
            featuresPromise.then((featureGroups) => {
              let items = [];
              for (let g = 0, gg = featureGroups.length; g < gg; g++) {
                const layers = Object.keys(featureGroups[g]);
                for (let l = 0, ll = layers.length; l < ll; l++) {
                  const layer = layers[l];
                  items.push({ layer: layer, features: featureGroups[g][layer]});
                }
              }
              if (items.length > 0) {
                map.addPopup(
                <WMSPopup
                  coordinate={xy}
                  closeable
                  items={items}
                />
                );
              }
            });
          }}>
          <ZoomControl />
        </SdkMap>
      </div>
    )
  }
}
const mapStateToProps = (state, { match }) => {
  return {
    viewparams: match.params.viewparams,
    mapConfig: state.local.mapConfig
  }
}
export default withRouter(connect(mapStateToProps, actions)(Map));
