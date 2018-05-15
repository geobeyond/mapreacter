import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SdkMap from '@boundlessgeo/sdk/components/map';
//import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
//import SdkZoomSlider from '@boundlessgeo/sdk/components/map/zoom-slider';
import SdkMousePosition from '@boundlessgeo/sdk/components/map/mouseposition';
import SdkScaleLine from '@boundlessgeo/sdk/components/map/scaleline';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import ol from 'ol';
import Control from 'ol/control/control';
import OverviewMap from 'ol/control/overviewmap';
//import FullScreen from 'ol/control/fullscreen';
import WMSPopup from './map/wms/wmspopup'
import ZoomControl from './map/zoom-control';
import * as actions from '../actions/map';
import { store } from '../App';

const LegendControl = function (opt_options) {

  var theInfo = document.createElement('div');
  theInfo.innerHTML = '<p style="color:#00ffff">this is a simple string</p>';
  theInfo.style.float = 'right';
  theInfo.style.display = 'none';

  var options = opt_options || {};

  var theButton = document.createElement('button');
  theButton.innerHTML = 'L';

  //var this_ = this;
  var handleLegendControl = function () {
    console.log("handleLegendControl()", theInfo.style.display);
    //this_.getMap().getView().setRotation(0);
    if (theInfo.style.display === 'block' || theInfo.style.display === '') {
      theInfo.style.display = 'none';
    } else {
      theInfo.style.display = 'block';
    }
  };

  theButton.addEventListener('click', handleLegendControl, false);
  theButton.addEventListener('touchstart', handleLegendControl, false);

  var element = document.createElement('div');
  element.className = 'legend-control ol-unselectable ol-control';
  element.appendChild(theButton);
  element.appendChild(theInfo);

  Control.call(this, {
    element: element,
    target: options.target
  });

};

ol.inherits(LegendControl, Control);

class Map extends Component {

  componentDidMount() {
    console.log("Map.componentDidMount()");
    if (this.props.viewparams) {
      this.updateLayer(this.props.viewparams);
    } else {
      this.updateLayer('*');
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("Map.componentWillReceiveProps()");
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
    let token = this.props.local.mapConfig.basemap === 'mapbox' ? this.props.local.mapConfig.mapbox.token : '';

    return (
      <div className="client-map" style={{ width: '100%', height: '100%' }}>
        <SdkMap
          ref={(input) => {
            if (input) {
              input.wrappedInstance.map.addControl(new OverviewMap());
              //input.wrappedInstance.map.addControl(new FullScreen());
              input.wrappedInstance.map.addControl(new LegendControl());
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
          <SdkMousePosition style={window.config.SdkMousePosition.style} />
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
    local: state.local
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
