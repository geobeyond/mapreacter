import React from 'react';
import PropTypes from 'prop-types';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';

import Paper from 'material-ui/Paper';
import {List} from 'material-ui/List';

import AddWMSLayer from './map/wms/wmslayer'
import WMSPopup from './map/wms/wmspopup'
import LayerListItem from './map/layerlistitem'
import ZoomControl from './map/zoom-control';

class Map extends React.Component {
  render() {
    let layerListStyle = {
      margin: 0
    }
    return(
      <div className="client-map">
        <SdkMap
          style={{position: 'relative'}}
          includeFeaturesOnClick
          onClick={(map, xy, featuresPromise) => {
            featuresPromise.then((featureGroups) => {
              let features = [];
              for (let g = 0, gg = featureGroups.length; g < gg; g++) {
                const layers = Object.keys(featureGroups[g]);
                for (let l = 0, ll = layers.length; l < ll; l++) {
                  const layer = layers[l];
                  features = features.concat(featureGroups[g][layer]);
                }
              }
              if (features.length > 0) {
                map.addPopup(<WMSPopup
                  coordinate={xy}
                  closeable
                  features={features}
                />);
              }
            });
          }}>
          <ZoomControl />
        </SdkMap>
        <div id="controls">
          <Paper>
            <List>
              <SdkLayerList style={layerListStyle} className='layer-list' layerClass={LayerListItem}/>
            </List>
          </Paper>
        </div>
      </div>
    )
  }
}
export default Map;
