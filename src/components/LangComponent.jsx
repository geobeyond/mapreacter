import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { mylocalizedstrings } from '../services/localizedstring';

class LangComponent extends Component {

    handleChangeLanguage = (event) => {
        mylocalizedstrings.setLanguage(event.target.value);
        this.props.changeLang(event.target.value);
        this.setState({});
    };

    render() {
        console.log("LangComponent.render()", this.props);
        const { style } = this.props;
        return (
            <Select
                //color='primary'
                style={style}
                value={mylocalizedstrings.getLanguage()}
                onChange={this.handleChangeLanguage}
                inputProps={{
                    name: 'language',
                    id: 'language',
                }}
            >
                <MenuItem value={'it'}>ITA</MenuItem>
                <MenuItem value={'en'}>ENG</MenuItem>
            </Select>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        local: state.local,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeLang: (lang) => {
            dispatch({
                type: 'LOCAL.CHANGELANG',
                payload: {
                    lang: lang
                }
            });
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LangComponent));