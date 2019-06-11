// Import libraries
import React from 'react';
import { Dimensions, Platform, StyleSheet, SafeAreaView, View } from 'react-native';
import { Button, Card, Divider, Icon, ListItem, SearchBar, Text } from 'react-native-elements';
import { Constants, Location, MapView, Permissions } from 'expo';

const { width, height } = Dimensions.get('window');
const recentList = [
  {
    name: 'Bar Farha',
    icon: 'local-bar',
    subtitle: 'Bar'
  },
  {
    name: 'Food Truck Friday',
    icon: 'event',
    subtitle: 'Activity'
  },
]
const nearbyList = [
  {
    name: 'Robert\'s Burgers',
    icon: 'restaurant',
    subtitle: 'Bar'
  },
  {
    name: 'Modern Art Insititute',
    icon: 'account-balance',
    subtitle: 'Culture'
  },
]

// Build Class Component
export default class Home extends React.Component {
    state = {
      isBusy: false,
      mapLoaded: false,
      location: null,
      errorMessage: null,
      search: '',
      region: {
        longitude: -122,
        latitude: 37,
        longitudeDelta: 0.04,
        latitudeDelta: 0.09,
      }
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
          this.setState({
            errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
          });
        } else {
          this._getLocationAsync();
        }
      }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
            errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        this.setState({
            region: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            longitudeDelta: 0.00,
            latitudeDelta: 0.00,
          }});
    };
  
    _updateSearch = search => {
      this.setState({ search });
    };
  
    render() {
      const { search } = this.state;
      let text = 'Waiting..';

    if (this.state.errorMessage) {
        text = this.state.errorMessage;
    } 
    else if (this.state.location) {
        text = JSON.stringify(this.state.location);
    }
  
      return (
        <View style={styles.container}>
          <MapView
            style={{flex: 1}}
            region={this.state.region}
          />
          <View style={styles.card}>
            <Text style={styles.textGreeting}>
              Hello there!
            </Text>
            <Text h4 style={styles.textBanner}>
              What Interests You?
            </Text>
            {/* <SearchBar
              style={{marginBottom: 15}}
              placeholder="Type Here..."
              onChangeText={this._updateSearch}
              value={search}
              lightTheme
            /> */}
            { /*this._renderTonariList(recentList)*/ }
            <Text h4 style={{marginBottom: 10}}>
              隣 Near You 
            </Text>
            <Divider/>
            { /* this._renderTonariList(nearbyList)*/ }
          </View>
        </View>
      );
    }
  
    _renderTonariList(items) {
      return(items.map((l, i) => (
          <ListItem
            style={{ marginBottom: 15}}
            key={i}
            leftIcon={{ name: l.icon}}
            title={l.name}
            subtitle={l.subtitle}
            chevronColor="white"
            chevron
          />
        ))
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    card: {
      position: 'absolute',
      bottom: 0,
      left: 10,
      borderRadius: 20,
      backgroundColor: 'white',
      width: width - 20,
      padding:20,
    },
    cardButton: {
      borderRadius: 0, 
      marginLeft: 0, 
      marginRight: 0, 
      marginBottom: 0
    },
    textGreeting: {
      marginBottom: 15
    },
    textBanner: {
      marginBottom: 15
    }
  });
  