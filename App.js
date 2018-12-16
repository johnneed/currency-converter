/**
 /**
 * Currency Converter React Native App
 * https://github.com/johnneed/currency-converter
 */
import React from 'react';
import {WorldMap} from './components/world-map';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {countries} from './data/countries';

const api = 'http://data.fixer.io/api/latest?access_key=093403968e43916d2e1f9b0cdb61fe4b';

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: 20},
    footer: {
        height: 100
    }
});

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.setCountry = this.setCountry.bind(this);
    }

    state = {rates: null, fromTo: 'from', to: null, from: null};

    componentDidMount() {
        fetch(api)
            .then(response => response.json())
            .then(rates => this.setState({rates}));
    }

    setCountry(toFrom) {
        return (iso2) => {
            const nextFromTo = this.state.fromTo === 'from' ? 'to' : 'from';
            this.setState({[toFrom]: iso2, fromTo: nextFromTo});
        };
    }

    render() {
        const fromCurrency = ((countries[this.state.from] || {}).currency || {}).name;
        const toCurrency = ((countries[this.state.to] || {}).currency || {}).name;

        return (
            <View style={styles.container}>
                <View style={styles.footer}>
                    <Text>{fromCurrency || ''}</Text>
                    <Text>{toCurrency || ''}</Text>
                </View>
                <WorldMap onSelect={this.setCountry(this.state.fromTo)}/>

            </View>
        );
    }
}

