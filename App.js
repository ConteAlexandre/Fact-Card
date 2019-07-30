import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FactCard from "./component/fact-card";

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Fact Swipe!!</Text>
          <FactCard/>
        </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30
  }
});
