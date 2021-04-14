import React from "react";
import { Appbar } from "react-native-paper";

function NavigationBar(props: any) {
  const { navigation, previous } = props;

  return (
    <Appbar.Header dark={true}>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={ previous ? "" : "隣 Near You"} />
      <Appbar.Action icon="playlist-plus" onPress={() => navigation.push('NotFound')} />
      <Appbar.Action
        icon="cog"
        onPress={() => navigation.push('NotFound')}
      />
    </Appbar.Header>
  );
}

export default NavigationBar;
