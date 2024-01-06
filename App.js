import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/Main';
import React from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  React.useEffect(() => {
    const db = SQLite.openDatabase('place.db');
db.transaction(
  (tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS place (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image TEXT, formattedAddress TEXT, latitude REAL, longitude REAL);'
    );
  },
  null,
  null
);
  }, []);
  return (
    <Main/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
