import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function Header() {
  return (
    <Appbar.Header style={styles.appBar}>
      {/* <Appbar.Action icon="menu" onPress={() => { }} color="#fff" /> */}
      <Appbar.Content title="  Vision AI" titleStyle={styles.title} />
      <Appbar.Action icon="cog" onPress={() => { }} color="#fff" />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});