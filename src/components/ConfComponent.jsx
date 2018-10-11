import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as mapActions from '@boundlessgeo/sdk/actions/map';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import * as drawingActions from '@boundlessgeo/sdk/actions/drawing';
import { INTERACTIONS } from '@boundlessgeo/sdk/constants';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import * as configActions from '../actions/map';
import { mylocalizedstrings } from '../services/localizedstring';
import { downloadFile } from '../services/download';
import { theBrowserItem, theBrowserVersion } from './BrowserVerComponent';


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
            if (rec.flag_filter) {
                if (rec['layout']) {
                    if (rec.layout.visibility === 'visible') {
                        _array.push(rec.id);
                    }
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
                    open={this.state.sharedialog}
                    onClose={() => { this.setState({ sharedialog: false }); }}
                >
                    <DialogTitle>{mylocalizedstrings.sharetitle}</DialogTitle>
                    {/*
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {mylocalizedstrings.sharetitle}
                        </DialogContentText>
                    </DialogContent> */}
                    <DialogActions>
                        <Button onClick={() => { this.setState({ sharedialog: false }); }}>
                            {mylocalizedstrings.close}
                        </Button>
                    </DialogActions>
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


                    <MenuItem
                        disabled={navigator.userAgent.indexOf("Edge")>-1}
                        onClick={(event) => {
                            this.props.exportMapImage();
                            this.handleCloseMenu();
                        }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>PNG</span>
                    </MenuItem>

                    <MenuItem onClick={(event) => {
                        downloadFile(this.props.local.mapConfig.downloadCSVUrl, this.getActiveLayers(), '.csv', this.props.local.regProvComponent['filter']);
                        this.handleCloseMenu();
                    }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>CSV</span>
                    </MenuItem>

                    <MenuItem
                        disabled={navigator.userAgent.indexOf("Edge")>-1 && this.props.local.regProvComponent['filter'] && this.props.local.regProvComponent.filter.length>2000}
                        onClick={(event) => {
                            downloadFile(this.props.local.mapConfig.downloadShapefileUrl, this.getActiveLayers(), '.zip', this.props.local.regProvComponent['filter']);
                            this.handleCloseMenu();
                        }}>
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>Shapefile</span>
                    </MenuItem>

                    { /*
                    <MenuItem onClick={(event) => {
                        downloadFile(this.props.local.mapConfig.downloadPdfUrl, this.getActiveLayers(), '.pdf', this.props.local.regProvComponent['filter']);
                        this.handleCloseMenu();
                    }} >
                        <i className="material-icons">file_download</i><span style={{ padding: '10px' }}>PDF</span>
                    </MenuItem>
                    */ }

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

                    <MenuItem disabled style={{ fontStyle: 'italic', paddingTop: 0, paddingBottom: 0 }}>
                        {theBrowserItem.name} {theBrowserVersion}
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