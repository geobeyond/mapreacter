import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SdkMap from '@boundlessgeo/sdk/components/map';
//import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
//import SdkZoomSlider from '@boundlessgeo/sdk/components/map/zoom-slider';
import SdkMousePosition from '@boundlessgeo/sdk/components/map/mouseposition';
import SdkScaleLine from '@boundlessgeo/sdk/components/map/scaleline';
//import SdkLegend from '@boundlessgeo/sdk/components/legend';
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

  let options = opt_options || {};

  console.log("LegendControl()", options);

  let theInfo = document.createElement('div');
  theInfo.style.display = 'none';
  theInfo.style.float = 'right';
  theInfo.style.maxHeight = '300px';
  theInfo.style.maxWidth = '400px';
  theInfo.style.overflow = 'scroll';
  theInfo.style.padding = '10px';

  if (options['layers']) {
    options.layers.forEach((rec) => {
      if (rec['layout']) {
        if (rec.layout.visibility === 'visible') {

          if (rec.flag_legend) {
            console.log("LegendControl() add --->", JSON.stringify(rec));
            var theLayerName = document.createElement('div');
            theLayerName.style.display = 'block';
            theLayerName.style.paddingRight = '10px';
            theLayerName.innerHTML = '<span class="name">' + rec.id + '</span>';
            theInfo.appendChild(theLayerName);

            var theImage = document.createElement('div');
            theImage.class = 'sdk-legend';
            theImage.style.display = 'block';
            let _innerHTML = '<img alt="" class="sdk-legend-image" ' +
              'src="' + options.geoserverurl + '/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=' + rec.name + (rec['styles']?'&STYLE=' + rec.styles:'') + '">';
            console.log("LegendControl()", _innerHTML);
            theImage.innerHTML = _innerHTML;
            theInfo.appendChild(theImage);
          }
        }
      }
    });
  }

  var theButton = document.createElement('button');
  theButton.innerHTML = 'L';

  //var this_ = this;
  var handleLegendControl = function () {
    console.log("LegendControl.handleLegendControl()", theInfo.style.display);
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

  theLegendControl = null;
  interactions = [];

  constructor(props) {
    super(props);
    this.theLegendControl = new LegendControl({ layers: this.props.layers, geoserverurl: this.props.local.mapConfig.geoserverurl });
  }
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
    hiddenElement.href = window.URL.createObjectURL(blob);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'map.png';
    document.body.appendChild(hiddenElement); // necessario x firefox
    hiddenElement.click();
    store.dispatch(printActions.receiveMapImage());
    //this.props.receiveMapImage();
    setTimeout(function () {
      window.URL.revokeObjectURL(hiddenElement.href);
      document.body.removeChild(hiddenElement);
    }, 100);    
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
              input.wrappedInstance.map.removeControl(this.theLegendControl);
              this.theLegendControl = new LegendControl({ layers: this.props.layers, geoserverurl: this.props.local.mapConfig.geoserverurl });
              input.wrappedInstance.map.addControl(this.theLegendControl);
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
                    interactions={this.interactions}
                    onClose={function() { 
                      this.interactions.forEach(function(interaction) {
                        console.log("Map, enable --->",interaction);
                        interaction.setActive(true);
                      }, this);
                    }}
                  />, true, true
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
    local: state.local,
    layers: state.map.layers
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
