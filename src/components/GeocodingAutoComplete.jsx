import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import { mylocalizedstrings } from '../services/localizedstring';


var axios = require('axios');

const styles = theme => ({
  root: {
    margin: '15px',
    width: 'calc(40% - 100px)',
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
  //console.log("GeocodingAutoComplete.renderInput()");
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
  console.log("GeocodingAutoComplete.renderSuggestion()", JSON.stringify(suggestion));
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.place_id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      <Typography variant="subheading">
        {suggestion.label}
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



class GeocodingAutoComplete extends React.Component {


  constructor(props) {
    super(props);
    console.log("GeocodingAutoComplete()");
    this.state = {
      inputValue: '',
      selectedItem: [],
      suggestions: []
    };
  }

  handleKeyDown = event => {
    console.log("GeocodingAutoComplete.handleKeyDown()");
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleInputChange = event => {
    console.log("GeocodingAutoComplete.handleInputChange()", event.target.value);
    this.setState({ inputValue: event.target.value });

    const url = this.props.local.mapConfig.geocodingurl + event.target.value;
    console.log("GET", url);
    axios.get(url)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));      
        let _suggestion =  response.data.map( _record => {
          _record.label = _record.display_name;          
          return _record;
        })
        this.setState({ suggestions: _suggestion });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleChange = item => {
    console.log("GeocodingAutoComplete.handleChange() item=", item);

    this.setState({
      inputValue: '',
      selectedItem: [item],
    });

    let selectedRecord = this.getSuggestions(item)[0];
    console.log("GeocodingAutoComplete.handleChange()", JSON.stringify(selectedRecord));
    this.props.removeFeatures("geocoding");
    this.props.addFeatures("geocoding", selectedRecord.geojson);

    // Nominatim API returns a boundingbox property of the form: south Latitude, north Latitude, west Longitude, east Longitude
    let _extent = [
      Number(selectedRecord.boundingbox[2]), 
      Number(selectedRecord.boundingbox[0]), 
      Number(selectedRecord.boundingbox[3]), 
      Number(selectedRecord.boundingbox[1])
    ];
    if (_extent[0] !== 0 && _extent[1] !== 0 && _extent[2] !== -1 && _extent[3] !== -1) {
      this.props.fitExtent(_extent, this.props.mapinfo.size, "EPSG:4326");
      this.props.zoomOut();
    }
  };

  handleDelete = item => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({ selectedItem });
    console.log("RegProvAutocomplete.handleDelete()", item);
    this.props.removeFeatures("geocoding");
  };

  getSuggestions(inputValue) {
    console.log("GeocodingAutoComplete.getSuggestions()", inputValue);
    let count = 0;
    return this.state.suggestions.filter(suggestion => {
      return (count++ < 12)
    });
  }

  render() {
    //console.log("GeocodingAutoComplete.render()");
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
                    placeholder: `${mylocalizedstrings.addressautocompletelabel}`,
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

GeocodingAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  //console.log("GeocodingAutoComplete.mapStateToProps()");
  return {
    map: state.map,
    local: state.local,
    mapinfo: state.mapinfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addFeatures: (sourceName, features) => {
      dispatch(mapActions.addFeatures(sourceName, features));
    },
    removeFeatures: (sourceName, filter) => {
      dispatch(mapActions.removeFeatures(sourceName, filter));
    },
    fitExtent: (extent, size, projection) => {
      dispatch(mapActions.fitExtent(extent, size, projection));
    },
    zoomOut: () => {
      dispatch(mapActions.zoomOut());
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GeocodingAutoComplete)));