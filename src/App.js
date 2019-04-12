import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Card, Icon, ListItem, SearchBar, Text } from 'react-native-elements';
import { MapView } from 'expo';

const { width, height } = Dimensions.get('window');
const list = [
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

export default class App extends React.Component {
  state = {
    isBusy: false,
    mapLoaded: false,
    search: '',
    region: {
      longitude: -122,
      latitude: 37,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09,
    }
  }

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

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
          <SearchBar
            style={{marginBottom: 15}}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
            lightTheme
          />
          { this.renderTonariList(list) }
          <Text h4>
            隣 Near You 
          </Text>
          { this.renderTonariList(list) }
        </View>
      </View>
    );
  }

  renderTonariList(items) {
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
