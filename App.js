import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import FactCard from "./component/fact-card";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import axios from "axios";

const CARD_X_ORIGIN = wp("5%");
const MAX_LEFT_ROTATION_DISTANCE = wp("-150%")
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%")
const LEFT_TRESHOLD_BEFORE_SWIPE = wp("-50%");
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%");
const FACT_URL = "http://randomuselessfact.appspot.com/random.json?language=en"
const RANDOM_IMAGE_URL = "https://picsum.photos/200/300?image="

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { panResponder: undefined, topFact : undefined, bottomFact : undefined }
        this.position = new Animated.ValueXY();
    }

    componentDidMount() {
        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (e, gesture) => {
                return Math.abs(gesture.dx) > Math.abs(gesture.dy*3)
            },
            onPanResponderMove: (event,gesture) => {
                this.position.setValue({
                    x : gesture.dx,
                    y : 0
                })
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceLeftEXit();
                }else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceRightExit();
                }else {
                    this.resetPositionSoft();
                }
            }
        })
        this.setState({panResponder}, () => {
            axios.get(FACT_URL).then(response => {
                this.setState({
                    topFact : {
                        ...response.data,
                        image : this.getRandomImageUrl()
                    }
                })
            })
            this.loadBottomFact()
        });
    }

    loadBottomFact() {
        axios.get(FACT_URL).then(response => {
            this.setState({
                bottomFact : {
                    ...response.data,
                    image : this.getRandomImageUrl()
                }
            })
        })
    }

    getRandomImageUrl() {
        return `${RANDOM_IMAGE_URL}${Math.floor(Math.random()*500+1)}`
    }

    onCardExitDown =() => {
        this.setState({
            topFact: this.state.bottomFact
        })
        this.loadBottomFact();
        this.position.setValue({
            x : 0,
            y : 0
        })
    }

    forceLeftEXit() {
        Animated.timing(this.position, {
            toValue: { x : wp("-100%"), y : 0 }
        }).start(this.onCardExitDown)
    }

    forceRightExit() {
        Animated.timing(this.position, {
            toValue: { x : wp("100%"), y : 0 }
        }).start(this.onCardExitDown)
    }

    resetPositionSoft() {
        Animated.spring(this.position, {
            toValue: { x :0, y : 0 }
        }).start()
    }

    getCardStyles() {
        const rotation = this.position.x.interpolate({
            inputRange : [MAX_LEFT_ROTATION_DISTANCE, 0, MAX_RIGHT_ROTATION_DISTANCE],
            outputRange: ["-120deg", "0deg", "120deg"]
        })
        return {
            transform: [{rotate : rotation }],
            ...this.position.getLayout()
        }
    }

    renderTopCard() {
        return (
            <Animated.View
                style={this.getCardStyles()}
                {...this.state.panResponder.panHandlers}
            >
                <FactCard disabled={false} fact={this.state.topFact}/>
            </Animated.View>
        )
    }

    renderBottomCard() {
        return (
            <View style={{zIndex: -1, position: "absolute"}}>
                <FactCard disabled={true} fact={this.state.bottomFact}/>
            </View>
        )
    }

    render() {
        console.log(this.state.topFact, this.state.bottomFact)
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Fact Swipe!!</Text>
                <View>
                    {this.state.topFact && this.renderTopCard() }
                    {this.state.bottomFact && this.renderBottomCard() }
                </View>
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
