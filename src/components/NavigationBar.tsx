import React from "react";
import { Appbar } from "react-native-paper";

function NavigationBar(props: any) {
  const { navigation, previous } = props;

  return (
    <Appbar.Header>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="隣 Near You" />
    </Appbar.Header>
  );
}

export default NavigationBar;
