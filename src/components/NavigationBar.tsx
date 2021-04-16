import React from "react";
import { Appbar } from "react-native-paper";

function NavigationBar(props: any) {
  const { navigation, previous, scene } = props;


  const getTitle = () => previous ? scene.route.name : "隣";
  const getSubtitle = () => previous? "" : "Near You";

  return (
    <Appbar.Header dark={true}>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={getTitle()} subtitle={getSubtitle()} />
      <Appbar.Action
        icon="playlist-plus"
        onPress={() => navigation.push("NotFound")}
      />
      <Appbar.Action icon="cog" onPress={() => navigation.push("NotFound")} />
    </Appbar.Header>
  );
}

export default NavigationBar;
