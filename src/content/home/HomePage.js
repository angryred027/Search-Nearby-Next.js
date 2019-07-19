// Import libraries
import React from 'react';
import { Dimensions, Platform, StyleSheet, SafeAreaView, View } from 'react-native';
import { Button, Card, Divider, Icon, ListItem, SearchBar, Text } from 'react-native-elements';
import { Constants, Location, MapView, Permissions } from 'expo';
import { Marker, ProviderPropType } from 'react-native-maps'

const { width, height } = Dimensions.get('window');
const recentList = [
  {
    key: 3,
    title: 'Bar Farha',
    icon: 'local-bar',
    subtitle: 'Bar',
    latlng: {
      longitude: -87.652340,
      latitude: 41.886879
    }
  },
  {
    key:2, 
    title: 'Food Truck Friday',
    icon: 'event',
    subtitle: 'Activity',
    latlng: {
      longitude: -87.652340,
      latitude: 41.886879
    }
  },
]
const nearbyList = [
  {
    key: 0,
    title: 'Swift And Sons',
    icon: 'local-bar',
    subtitle: 'Bar',
    latlng: {
      longitude: -87.652340,
      latitude: 41.886879
    }
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
      },
      iconSize: 8, // TODO should grow/shrink based on zoom, default is 26
      showText: false, // TODO should change based on zoom
      nearby: nearbyList,
      recent: recentList,
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
              longitudeDelta: 0.04,
              latitudeDelta: 0.09,
          }
        });
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
          >
          {this._renderTonariMarkers()}
          </MapView>
          <View style={styles.card}>
            <Text h4 style={{marginBottom: 10}}>
              隣 Near You 
            </Text>
            <Divider/>
          </View>
          <View style={styles.menu}>
            <Icon size={20} name='menu' color='white' reverseColor='black' reverse/>
          </View>
        </View>
      );
    }

    _renderTonariMarkers() {
      return this.state.nearby.map(marker => (
        <Marker
          key={marker.key}
        coordinate={marker.latlng}
          title={marker.title}
          description={marker.subtitle}
        >
          <Icon size={this.state.iconSize} name={marker.icon} reverse />
        </Marker>
      ));
    }
  
    _renderTonariList(items) {
      return(items.map((l, i) => (
          <ListItem
            style={{ marginBottom: 15}}
            key={i}
            leftIcon={{ title: l.icon}}
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
    menu: {
      position: 'absolute',
      top: 25,
      left: 10
    },
    textGreeting: {
      marginBottom: 15
    },
    textBanner: {
      marginBottom: 15
    }
  });
  