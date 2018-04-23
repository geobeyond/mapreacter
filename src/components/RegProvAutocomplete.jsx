import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import GeoJSON from 'ol/format/geojson';
import WKT from 'ol/format/wkt';
//import WFS from 'ol/format/wfs';
import { mylocalizedstrings } from '../services/localizedstring';
import * as actions from '../actions/map';


var axios = require('axios');

const styles = theme => ({
  root: {
    margin: '15px',
    width: '400px',
    color: 'currentColor'
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    height: '25px',
    margin: '2px',
  },
  inputRoot: {
    flexWrap: 'wrap',
    color: 'currentColor'
  },
});



function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;
  console.log("RegProvAutocomplete.renderInput()");
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  console.log("RegProvAutocomplete.renderSuggestion()", JSON.stringify(suggestion));
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={mylocalizedstrings.getString(suggestion.sublabel, mylocalizedstrings.getLanguage()) + ' ' + suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      <Typography variant="subheading">
        {suggestion.label}
      </Typography>
      &nbsp;
      <Typography variant="caption" style={{ fontStyle: 'italic', }}>
        {mylocalizedstrings.getString(suggestion.sublabel, mylocalizedstrings.getLanguage())}
      </Typography>
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};



class RegProvAutocomplete extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selectedItem: [],
      suggestions: []
    };

    this.props.local.mapConfig.regprovconf.forEach(_record => {
      const url = _record.url + '&outputFormat=application/json&propertyName=' + _record.propertyname;
      console.log("GET", url);
      axios.get(url)
        .then((response) => {
          console.log("response:", JSON.stringify(response.data));
          this.setState(prevState => {
            return {
              suggestions: prevState.suggestions.concat(
                response.data.features.map(_feature => {
                  return ({
                    feature: _feature,
                    label: _feature.properties[_record.propertyname],
                    sublabel: _record.propertyname,
                    url: _record.url
                  });
                })
              )
            }
          });
          console.log("RegProvAutocomplete() this.state:", JSON.stringify(this.state));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }


  handleKeyDown = event => {
    console.log("RegProvAutocomplete.handleKeyDown()");
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleInputChange = event => {
    console.log("RegProvAutocomplete.handleInputChange()", event.target.value);
    this.setState({ inputValue: event.target.value });
  };

  handleChange = item => {
    console.log("RegProvAutocomplete.handleChange()", item);

    this.setState({
      inputValue: '',
      selectedItem: [item],
    });

    let selectedRecord = this.getSuggestions(item)[0];

    const url = selectedRecord.url +
      '&srsName=EPSG:4326' +
      '&outputFormat=application/json' +
      '&featureID=' + selectedRecord.feature.id;
    console.log("GET", url);
    axios.get(url)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));

        let feature_coll = (new GeoJSON()).readFeatures(response.data);
        console.log('-->', feature_coll);
        let feature_wkt = (new WKT()).writeFeature(feature_coll[0]);
        console.log('-->', feature_wkt);

        this.props.changeRegProvComponent({ geometry: feature_wkt });
      })
      .catch((error) => {
        console.error(error);
      });

  };

  handleDelete = item => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({ selectedItem });
    console.log("RegProvAutocomplete.handleDelete()", item);
    this.props.changeRegProvComponent({});
  };

  getSuggestions(inputValue) {
    console.log("RegProvAutocomplete.getSuggestions()", inputValue);
    let count = 0;

    return this.state.suggestions.filter(suggestion => {
      const keep = (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) && count < 12;
      if (keep) {
        count += 1;
      }
      return keep;
    });
  }

  render() {
    console.log("RegProvAutocomplete.render()");
    const { classes } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <div className={classes.root}>
        <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem} classes={classes}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex,
          }) => (
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  InputProps: getInputProps({
                    startAdornment: selectedItem.map(item => (
                      <Chip
                        key={item}
                        tabIndex={-1}
                        label={item}
                        className={classes.chip}
                        onDelete={this.handleDelete(item)}
                      />
                    )),
                    onChange: this.handleInputChange,
                    onKeyDown: this.handleKeyDown,
                    placeholder: `${mylocalizedstrings.regprovlabel}`,
                    id: 'integration-downshift-multiple',
                  }),
                })}
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {this.getSuggestions(inputValue2).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem: selectedItem2,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            )}
        </Downshift>
      </div>
    );
  }
}

RegProvAutocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  //console.log("RegProvAutocomplete.mapStateToProps()");
  return {
    map: state.map,
    local: state.local,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeRegProvComponent: (params) => {
      dispatch(actions.changeRegProvComponent(params));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegProvAutocomplete)));