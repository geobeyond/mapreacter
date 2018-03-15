import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import RefreshIndicator from 'material-ui/RefreshIndicator';

class RefreshIndicatorComponent extends Component {

    componentDidMount() {
        console.log("RefreshIndicatorComponent.componentDidMount() this.props=", JSON.stringify(this.props));
    }

    componentWillReceiveProps(nextProps) {
        console.log("RefreshIndicatorComponent.componentWillReceiveProps() props=", JSON.stringify(nextProps));
    }

    render() {
        console.log("RefreshIndicatorComponent.render()", this.props.refreshIndicator.status);
        if (this.props.refreshIndicator.status === "hide") {
            return null;
        }
        return (
            <RefreshIndicator
                size={60}
                left={10}
                top={10}
                status={this.props.refreshIndicator.status}
                style={{ display: 'inline-block', position: 'absolute' }}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        refreshIndicator: state.local.refreshIndicator,
    }
}

export default withRouter(connect(mapStateToProps)(RefreshIndicatorComponent));