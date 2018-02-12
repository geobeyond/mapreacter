import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import AutoComplete from 'material-ui/AutoComplete';
import { Menu, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { tassonomiastore, newDataAction } from './tassonomiaredux';

var axios = require('axios');

class TassonomiaAutoComplete extends Component {

  state = {
    dataSource: [],
    searchText: '',
  };

  constructor(props) {
    super(props);
    tassonomiastore.subscribe(() => {

      const _datasource = [];
      if (tassonomiastore.getState().phylumarr.length > 0) {
        _datasource.push({ text: '', value: (<Divider />), });
        _datasource.push({ text: '', value: (<MenuItem primaryText={'Phylum'} disabled={true} />), });
        tassonomiastore.getState().phylumarr.forEach(element => {
          _datasource.push({
            text: '/' + element,
            value: (<MenuItem primaryText={element} />),
          });
        });
      }
      if (tassonomiastore.getState().famigliaarr.length > 0) {
        _datasource.push({ text: '', value: (<Divider />), });
        _datasource.push({ text: '', value: (<MenuItem primaryText={'Famiglia'} disabled={true} />), });
        tassonomiastore.getState().famigliaarr.forEach(element => {
          _datasource.push({
            text: '/*/' + element,
            value: (<MenuItem primaryText={element} />),
          });
        });
      }
      if (tassonomiastore.getState().nomescientificoarr.length > 0) {
        _datasource.push({ text: '', value: (<Divider />), });
        _datasource.push({ text: '', value: (<MenuItem primaryText={'Specie'} disabled={true} />), });
        tassonomiastore.getState().nomescientificoarr.forEach(element => {
          _datasource.push({
            text: '/*/*/' + element,
            value: (<MenuItem primaryText={element} />),
          });
        });
      }

      this.setState({
        dataSource: _datasource,
      });
    });
  }

  handleUpdateInput = (value) => {
    console.log("TassonomiaAutoComplete.handleUpdateInput()");
    this.setState({
      searchText: value,
    });
    console.log("GET", this.props.url + value);
    axios.get(this.props.url + value)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));
        tassonomiastore.dispatch(newDataAction(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleOnNewRequest = (chosenRequest, index) => {
    console.log("TassonomiaAutoComplete.handleOnNewRequest()", chosenRequest, index);
    this.setState({
      searchText: '',
    });
    this.props.history.push(chosenRequest.text);
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText="Phylum / Famiglia ..."
          dataSource={this.state.dataSource}
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleOnNewRequest}
          filter={AutoComplete.noFilter}
          openOnFocus={true}
          maxSearchResults={15}
          id={'tassonomiaautocomplete'}
          className={'tassonomiaautocomplete'}
        />
      </div>
    );
  }

}

export default withRouter(TassonomiaAutoComplete);