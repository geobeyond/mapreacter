import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';
import Table, { TableBody, TableRow, TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';
import * as actions from '../actions/map';
import { mylocalizedstrings } from '../services/localizedstring';


class FeatureInfoComponent extends Component {

    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleClose = () => {
        this.props.changeFeatureInfoComponent({ open: false });
    };

    renderBody(value) {
        console.log("FeatureInfoComponent.renderBody() value=", value);
        let rows = [];
        try {
            this.props.featureInfoComponent.items[value].features.forEach((feature, index) => {
                const _keys = Object.keys(feature.properties);
                _keys.forEach(_key => {
                    rows.push(
                        <TableRow key={_key}>
                            <TableCell>{_key}</TableCell>
                            <TableCell>{feature.properties[_key]}</TableCell>
                        </TableRow>
                    );
                });
            });
        } catch (error) {
            console.error(error);
        }
        return rows;
    }

    render() {
        console.log("FeatureInfoComponent.render()", this.props.featureInfoComponent.open);
        const { value } = this.state;
        if (!this.props.featureInfoComponent.open) { return null }
        return (
            <Dialog open={this.props.featureInfoComponent.open} >
                <DialogContent>
                    <Tabs
                        //indicatorColor="primary"
                        //textColor="primary"
                        scrollable
                        scrollButtons="on"
                        value={value}
                        onChange={this.handleChange}
                    >
                        {
                            this.props.featureInfoComponent.items.map(item => (
                                <Tab key={item.layer} label={item.layer} />
                            ))
                        }
                    </Tabs>
                    <Table>
                        <TableBody>{this.renderBody(value)}</TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>{mylocalizedstrings.close}</Button>
                </DialogActions>
            </Dialog>
        )
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }
}

const mapStateToProps = (state) => {
    return {
        featureInfoComponent: state.local.featureInfoComponent,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeFeatureInfoComponent: (params) => {
            dispatch(actions.changeFeatureInfoComponent(params));
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FeatureInfoComponent));