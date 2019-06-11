import React from 'react';
import { Dimensions, StyleSheet, SafeAreaView, View } from 'react-native';
import { Button, Card, Divider, Icon, ListItem, SearchBar, Text } from 'react-native-elements';
import { MapView } from 'expo';

import { default as HomePage } from './content/home/HomePage';


export default class App extends React.Component {
  render() {
    return (
      <HomePage/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
