import React, {Component} from 'react';
import {MapView} from 'expo';
import PropTypes from 'prop-types';

const apiURL = 'http://api.geonames.org/findNearbyJSON?lat={lat}&lng={long}&username=johnneed';

const findCountry = (location) => {
    const url = apiURL.replace('{lat}', location.latitude).replace('{long}', location.longitude);
    return fetch(url).then(response => response.json());
};

export class WorldMap extends Component {

    static propTypes = {
        onSelect: PropTypes.func
    };


    constructor(props) {
        super(props);
        this.onMapTap = this.onMapTap.bind(this);
    }

    onMapTap(data) {
        const location = data.nativeEvent.coordinate;
        findCountry(location).then(_data => {
            const countryCode = _data.geonames[0].countryCode;
            this.props.onSelect(countryCode);
        });
    }

    render() {
        return (
            <MapView
                style={{flex: 1}}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                onPress={this.onMapTap}
            />
        );
    }

}

