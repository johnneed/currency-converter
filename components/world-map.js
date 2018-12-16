import React, {Component} from 'react';
import {MapView} from 'expo';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity,Text} from 'react-native';

const apiURL = 'http://api.geonames.org/findNearbyJSON?lat={lat}&lng={long}&username=johnneed';

const findCountry = (location) => {
    const url = apiURL.replace('{lat}', location.latitude).replace('{long}', location.longitude);
    return fetch(url).then(response => response.json());
};

const styles = StyleSheet.create(
    {
        container: {flex: 1}
    });

export class WorldMap extends Component {

    static propTypes = {
        close: PropTypes.func,
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
        this.props.close();
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={{flex: 1}}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    onPress={this.onMapTap}
                />
            </View>
        );
    }

}

