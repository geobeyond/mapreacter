import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import LayerListItem from './map/LayerListItem';
import Menu from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { mylocalizedstrings } from '../services/localizedstring';

class TocComponent extends Component {

    state = {
        sharedialog: false,
        anchorEl: null
    };

    handleOpenMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl: null });
    };

    componentDidMount() {
        console.log("TocComponent.componentDidMount() this.props=", JSON.stringify(this.props));
    }

    render() {
        console.log("TocComponent.render()", this.props['style']);
        const { anchorEl } = this.state;
        return (
            <div>
                <IconButton onClick={this.handleOpenMenu}>
                    <i className="material-icons">folder_open</i>
                </IconButton>
                <Menu
                    id="menu-toc"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseMenu}
                >
                    <div>
                        <ul className="sdk-layer-list" >
                            <li className="sdk-layer" >
                                <div className="toc-container">
                                    <div className="div1"><span className="name">{mylocalizedstrings.layer}</span> </div>
                                    <div className="div2"><span className="name">{mylocalizedstrings.onoff}</span> </div>
                                    <div className="div3"><span className="name">{mylocalizedstrings.updown}</span> </div>
                                    <div className="div4"><span className="name">{mylocalizedstrings.legend}</span> </div>
                                </div>
                            </li>
                        </ul>
                        <hr />
                        <SdkLayerList layerClass={LayerListItem} />
                    </div>
                </Menu>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        local: state.local,
    }
}

export default withRouter(connect(mapStateToProps)(TocComponent));