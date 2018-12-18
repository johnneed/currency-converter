/**
 /**
 * Currency Converter React Native App
 * https://github.com/johnneed/currency-converter
 */
import React from 'react';
import {WorldMap} from './components/world-map';
import {
    TouchableHighlight,
    TextInput,
    StyleSheet,
    Modal,
    Text,
    View
} from 'react-native';
import {countries} from './data/countries';

const api = 'http://data.fixer.io/api/latest?access_key=093403968e43916d2e1f9b0cdb61fe4b';

const styles = StyleSheet.create({
    button: {height: 40, width: 50, backgroundColor: '#EEE', marginLeft: 10, borderColor: '#AAA', borderWidth: 1},
    buttonText: {textAlign: 'center', lineHeight: 40, height: 40},
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'

    },
    control: {flex: 1, flexDirection: 'row', justifyContent: 'center'},
    countryName: {textAlign: 'center', height: 20},
    label: {flex: 1, height: 60, alignItems: 'stretch', justifyContent: 'center'},
    input: {height: 40, width: 100, borderColor: 'gray', borderWidth: 1, textAlign: 'center'}
});

const formatNumber = (text) => {
    const temp = parseFloat(text);
    if (!isNaN(temp)) {
        const splits = temp.toString().split('.');
        return `${splits[0]}${text.indexOf('.') > -1 ? '.' : ''}${(splits[1] || '').slice(0, 2)}`;
    }
    return '';
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.setCountry = this.setCountry.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.convert = this.convert.bind(this);
    }

    state = {amount: '1.00', rates: null, fromTo: 'from', to: 'CA', from: 'US', modalVisible: false};

    componentDidMount() {
        fetch(api)
            .then(response => response.json())
            .then(rates => this.setState({rates: rates.rates}));
    }

    setCountry(toFrom) {
        return (iso2) => {
            const nextFromTo = this.state.fromTo === 'from' ? 'to' : 'from';
            this.setState({[toFrom]: iso2, fromTo: nextFromTo});
        };
    }


    toggleModal(settings) {
        this.setState({...settings, modalVisible: !this.state.modalVisible});
    }


    convert() {
        const {amount, rates, from, to} = this.state;
        const fromCurrency = ((countries[from] || {}).currency || {}).code;
        const toCurrency = ((countries[to] || {}).currency || {}).code;
        const _amount = parseFloat(amount);
        // Base currency is the Euro. 
        const fromRate = rates && rates[fromCurrency];
        const toRate = rates && rates[toCurrency];

        return Boolean(!isNaN(_amount) && fromRate && toRate) ? Math.round(amount / fromRate * toRate * 100) / 100 : '';
    }

    render() {
        const fromCurrency = ((countries[this.state.from] || {}).currency || {}).code;
        const toCurrency = ((countries[this.state.to] || {}).currency || {}).code;
        const fromCountry = this.state.amount === 1 ?  ((countries[this.state.from] || {}).currency || {}).name :  ((countries[this.state.from] || {}).currency || {}).namePlural;
        const toCountry =((countries[this.state.to] || {}).currency || {}).namePlural;

        return (
            <View style={styles.container}>
                <View style={{height: 280, backgroundColor: '#EEE'}}>
                    <Text style={{fontSize: 30, lineHeight: 40, textAlign: 'center'}}>{'Currency Converter'}</Text>
                    <View style={styles.label}>
                        <Text style={styles.countryName}>{fromCountry || ''}</Text>
                        <View style={styles.control}>
                            <TextInput
                                keyboardType = {'decimal-pad'}
                                style={styles.input}
                                onChangeText={(text) => this.setState({amount: formatNumber(text)})}
                                value={this.state.amount}
                            />
                            <TouchableHighlight
                                onPress={() => this.toggleModal({fromTo: 'from'})}
                                style={styles.button}>
                                <Text style={styles.buttonText}>{fromCurrency || ''}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View>
                        <Text
                            style={{textAlign: 'center', height: 50, lineHeight: 50}}>{' is the equivalent of '}</Text>
                    </View>
                    <View style={styles.label}>
                        <View style={styles.control}>
                            <Text style={[styles.input, {borderColor: '#DDD', lineHeight: 40}]}>
                                {this.convert()}
                            </Text>
                            <TouchableHighlight
                                onPress={() => this.toggleModal({fromTo: 'to'})}
                                style={styles.button}>
                                <Text style={styles.buttonText}>{toCurrency || ''}</Text>
                            </TouchableHighlight>
                        </View>
                        <Text style={styles.countryName}>{toCountry || ''}</Text>
                    </View>
                    <View style={[styles.control, {marginTop: 10}]}>
                        <TouchableHighlight
                            onPress={() => this.setState({to: 'JP'})}
                            style={[styles.button, {width: 40}]}>
                            <Text style={styles.buttonText}>{'‎¥‎'}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => this.setState({to: 'CN'})}
                            style={[styles.button, {width: 40}]}>
                            <Text style={styles.buttonText}>{'CN‎¥'}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => this.setState({to: 'IN'})}
                            style={[styles.button, {width: 40}]}>
                            <Text style={styles.buttonText}>{'‎₹'}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => this.setState({to: 'FR'})}
                            style={[styles.button, {width: 40}]}>
                            <Text style={styles.buttonText}>{'€'}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={this.toggleModal}>
                    <WorldMap close={this.toggleModal} onSelect={this.setCountry(this.state.fromTo)}/>
                </Modal>
            </View>
        );
    }
}

