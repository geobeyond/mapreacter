import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as mapActions from '@boundlessgeo/sdk/actions/map';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import * as drawingActions from '@boundlessgeo/sdk/actions/drawing';
import { INTERACTIONS } from '@boundlessgeo/sdk/constants';

import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import * as configActions from '../actions/map';
import { mylocalizedstrings } from '../services/localizedstring';
import { downloadFile } from '../services/download';


class ConfComponent extends Component {

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
        console.log("ConfComponent.componentDidMount() this.props=", JSON.stringify(this.props));
    }

    getActiveLayers() {
        let _array = [];
        this.props.layers.forEach((rec) => {
            if (rec['layout']) {
                if (rec.layout.visibility === 'visible') {
                    _array.push(rec.id);
                }
            }
        });
        return _array;
    }

    render() {
        console.log("ConfComponent.render()");
        const { anchorEl } = this.state;
        return (
            <div>
                <IconButton onClick={this.handleOpenMenu}>
                    <i className="material-icons">more_vert</i>
                </IconButton>

                <Dialog
                    actions={[
                        <Button onClick={() => { this.setState({ sharedialog: false }); }}>{mylocalizedstrings.close}</Button>,
                    ]}
                    open={this.state.sharedialog}
                    onClose={() => { this.setState({ sharedialog: false }); }}
                >
                    <DialogTitle>{mylocalizedstrings.sharetitle}</DialogTitle>
                </Dialog>

                <Menu
                    id="menu-conf"
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
                    <MenuItem onClick={(event) => {
                        let url = this.props.local.mapConfig.helpUrl + mylocalizedstrings.getLanguage() + this.props.local.mapConfig.helpDoc;
                        let win = window.open(url, '_blank');
                        win.focus();
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">help</i>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        var _txt = document.createElement('textarea');
                        _txt.value = window.location.href; //chrome
                        _txt.textContent = window.location.href; //firefox
                        document.body.appendChild(_txt);
                        _txt.select();
                        document.execCommand('copy');
                        console.log(_txt);
                        document.body.removeChild(_txt);
                        this.setState({ sharedialog: true });
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">share</i>
                    </MenuItem>


                    <MenuItem onClick={(event) => {
                        this.props.exportMapImage();
                        this.handleCloseMenu();
                    }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>PNG</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        downloadFile(this.props.local.mapConfig.downloadCSVUrl, this.getActiveLayers(), '.csv');
                        this.handleCloseMenu();
                    }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>CSV</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        downloadFile(this.props.local.mapConfig.downloadShapefileUrl, this.getActiveLayers(), '.zip');
                        this.handleCloseMenu();
                    }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>Shapefile</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        downloadFile(this.props.local.mapConfig.downloadPdfUrl, this.getActiveLayers(), '.pdf');
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>PDF</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        this.props.startMeasure(INTERACTIONS.measure_line);
                        this.props.changeMeasureComponent({ open: true });
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">photo_size_select_small</i><span style={{ padding: '10px' }}>{mylocalizedstrings.line}</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        this.props.startMeasure(INTERACTIONS.measure_polygon);
                        this.props.changeMeasureComponent({ open: true });
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">photo_size_select_small</i><span style={{ padding: '10px' }}>{mylocalizedstrings.polygon}</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        let zoom = this.props.local.mapConfig.map.zoom || 2;
                        this.props.setView(this.props.local.mapConfig.map.center, zoom);
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">fullscreen</i>
                    </MenuItem>
                </Menu>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        local: state.local,
        layers: state.map.layers,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setView: (...params) => {
            dispatch(mapActions.setView(...params));
        },
        startMeasure: (...params) => {
            dispatch(drawingActions.startMeasure(...params));
        },
        changeMeasureComponent: (...params) => {
            dispatch(configActions.changeMeasureComponent(...params));
        },
        exportMapImage: (...params) => {
            dispatch(printActions.exportMapImage(...params));
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfComponent));