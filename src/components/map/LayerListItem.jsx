import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { types, layerListItemSource, layerListItemTarget, collect, collectDrop } from '@boundlessgeo/sdk/components/layer-list-item';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';
import IconButton from '@material-ui/core/IconButton';
import { fitextent } from '../../actions/map';


class LayerListItem extends SdkLayerListItem {
  render() {
    const layer = this.props.layer;
    const checkbox = this.getVisibilityControl(layer);

    let fitextentbutton = null;
    if (layer.type !== "raster") {
      fitextentbutton = (
        <IconButton
          onClick={() => {
            this.props.dispatch(fitextent(this.props.layer.id));
          }}>
          <i className="material-icons">fullscreen</i>
        </IconButton>
      );
    }

    let moveButtons = (
      <span className="btn-container" style={{width: '100%'}}>
        <IconButton
          onClick={() => {
            this.moveLayerUp();
          }}>
          <i className="material-icons">arrow_upward</i>
        </IconButton>
        <IconButton
          onClick={() => {
            this.moveLayerDown();
          }}>
          <i className="material-icons">arrow_downward</i>
        </IconButton>
        {fitextentbutton}
      </span>
    );

    return this.props.connectDragSource(this.props.connectDropTarget((
      <li className="sdk-layer">
        <div className="toc-container">
          <div className="div1"><span className="name">{layer.id}</span> </div>
          <div className="div2">{checkbox} </div>
          <div className="div3">{moveButtons}</div>
        </div>
      </li>
    )));
  }
}

LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));

export default LayerListItem;