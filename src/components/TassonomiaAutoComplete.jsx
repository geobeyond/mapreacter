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
      tassonomiastore.getState().phylumarr.forEach(element => {
        _datasource.push({
          text: '/' + element,
          value: (<MenuItem primaryText={element} />),
        });
      });
      _datasource.push({ text: '', value: (<Divider />), });
      tassonomiastore.getState().famigliaarr.forEach(element => {
        _datasource.push({
          text: '/*/' + element,
          value: (<MenuItem primaryText={element} />),
        });
      });
      _datasource.push({ text: '', value: (<Divider />), });
      tassonomiastore.getState().nomescientificoarr.forEach(element => {
        _datasource.push({
          text: '/*/*/' + element,
          value: (<MenuItem primaryText={element} />),
        });
      });

      this.setState({
        dataSource: _datasource,
      });
    });
  }

  handleUpdateInput = (value) => {
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
        />
      </div>
    );
  }

}

export default withRouter(TassonomiaAutoComplete);