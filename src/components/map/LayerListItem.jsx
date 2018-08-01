import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { types, layerListItemSource, layerListItemTarget, collect, collectDrop } from '@boundlessgeo/sdk/components/layer-list-item';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';
import Button from '@material-ui/core/Button';
import { fitextent } from '../../actions/map';


class LayerListItem extends SdkLayerListItem {
  render() {
    const layer = this.props.layer;
    const checkbox = this.getVisibilityControl(layer);

    let fitextentbutton = null;
    if (layer.flag_filter) {
      fitextentbutton = (
        <Button className="button"
          onClick={() => {
            this.props.dispatch(fitextent(this.props.layer.id));
          }}>
          <i className="material-icons">fullscreen</i>
        </Button>
      );
    }

    let moveButtons = (
      <span className="btn-container" style={{width: '100%'}}>
        <Button mini className="button"
          onClick={() => {
            this.moveLayerUp();
          }}>
          <i className="material-icons">arrow_upward</i>
        </Button>
        <Button className="button"
          onClick={() => {
            this.moveLayerDown();
          }}>
          <i className="material-icons">arrow_downward</i>
        </Button>
        {fitextentbutton}
      </span>
    );

    return this.props.connectDragSource(this.props.connectDropTarget((
      <li className="sdk-layer">
        <div className="toc-container">
          <div className="div1" dangerouslySetInnerHTML={{__html: '<span class='+(layer.class?layer.class:'name')+'>'+layer.id+(layer.description?'<br/>'+layer.description:'')+'</span>'}} />
          <div className="div2">{checkbox} </div>
          <div className="div3">{moveButtons}</div>
        </div>
      </li>
    )));
  }
}

LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));

export default LayerListItem;