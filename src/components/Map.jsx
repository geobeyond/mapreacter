import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SdkMap from '@boundlessgeo/sdk/components/map';
//import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
//import SdkZoomSlider from '@boundlessgeo/sdk/components/map/zoom-slider';
import SdkMousePosition from '@boundlessgeo/sdk/components/map/mouseposition';
import SdkScaleLine from '@boundlessgeo/sdk/components/map/scaleline';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import OverviewMap from 'ol/control/overviewmap';
//import FullScreen from 'ol/control/fullscreen';
import WMSPopup from './map/wms/wmspopup'
import ZoomControl from './map/zoom-control';
import * as actions from '../actions/map';
import { store } from '../App';

class Map extends Component {

  componentDidMount() {
    console.log("Map.componentDidMount() this.props=", JSON.stringify(this.props));
    if (this.props.viewparams) {
      this.updateLayer(this.props.viewparams);
    } else {
      this.updateLayer('none');
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("Map.componentWillReceiveProps() props=", JSON.stringify(nextProps));
    if (nextProps.viewparams !== this.props.viewparams) {
      //this.updateLayer(nextProps.viewparams);
      setTimeout(function () {
        console.log('timeout ...');
        this.updateLayer(nextProps.viewparams);
      }.bind(this), 500);
    }
  }
  updateLayer(viewparams) {
    console.log("Map.updateLayer()", viewparams);
    //store.dispatch(actions.setViewParams(viewparams));
    this.props.setViewParams(viewparams);
    this.props.updateLayersWithViewparams(viewparams.split("/"));
  }
  exportMapImage(blob) {
    console.log("Map.exportMapImage()", blob);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = (window.URL).createObjectURL(blob);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'map.png';
    hiddenElement.click();
    store.dispatch(printActions.receiveMapImage());
    //this.props.receiveMapImage();
  };
  render() {
    console.log("Map.render()");
    let token = this.props.mapConfig.basemap === 'mapbox' ? this.props.mapConfig.mapbox.token : '';

    return (
      <div className="client-map">
        <SdkMap
          ref={(input) => {
            if (input) {
              input.wrappedInstance.map.addControl(new OverviewMap());
              //input.wrappedInstance.map.addControl(new FullScreen());
            }
          }}
          style={{ position: 'relative' }}
          accessToken={token}
          includeFeaturesOnClick
          onExportImage={this.exportMapImage}
          onClick={(map, xy, featuresPromise) => {
            this.props.changerefreshindicator({ status: "loading" });
            featuresPromise.then((featureGroups) => {
              let items = [];
              featureGroups.forEach((feature, index) => {
                const layers = Object.keys(feature);
                layers.forEach((layer) => {
                  console.log("SdkMap.onClick()=", layer, featureGroups[index][layer]);
                  if (featureGroups[index][layer].length > 0) {
                    items.push({ layer: layer, features: featureGroups[index][layer] });
                  }
                });
              });
              if (items.length > 0) {
                map.addPopup(
                  <WMSPopup
                    coordinate={xy}
                    closeable
                    items={items}
                  />
                );
              }
              this.props.changerefreshindicator({ status: "hide" });
            });
          }}>
          <SdkScaleLine />
          <SdkMousePosition style={{ position: 'absolute', top: 10, right: 40, zIndex: 1, width: '5em' }} />
          <ZoomControl />
          {/* <SdkZoomSlider /> */}
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


const mapDispatchToProps = (dispatch) => {
  return {
    updateLayersWithViewparams: (params) => {
      dispatch(actions.updateLayersWithViewparams(params));
    },
    setViewParams: (params) => {
      dispatch(actions.setViewParams(params));
    },
    changerefreshindicator: (params) => {
      dispatch(actions.changerefreshindicator(params));
    },
    receiveMapImage: () => {
      dispatch(printActions.receiveMapImage());
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Map));
