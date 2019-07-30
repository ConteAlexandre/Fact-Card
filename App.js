import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import FactCard from "./component/fact-card";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { panResponder: undefined }
    this.position = new Animated.ValueXY();
  }

  componentDidMount() {
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event,gesture) => {
        this.position.setValue({
          x : gesture.dx,
          y : 0
        })
      }
    })
    this.setState({panResponder})
  }

  getCardStyles() {
    const rotation = this.position.x.interpolate({
      inputRange : [-200,0,200],
      outputRange: ["-120deg", "0deg", "120deg"]
    })
    return {
      transform: [{rotate : rotation }],
      ...this.position.getLayout()
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Fact Swipe!!</Text>
          {this.state.panResponder &&
          <Animated.View
              {...this.state.panResponder.panHandlers}
              style={this.getCardStyles()}
          >
            <FactCard/>
          </Animated.View>
          }
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
    fontSize: 30,
    marginBottom: 15
  }
});
