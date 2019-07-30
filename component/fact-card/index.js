import React, {Component} from 'react';
import { View, Image, Button, Text, Animated } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

class FactCard extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View
                style={{
                    elevation: 1,
                    shadownColor: "black",
                    shadowOffset: { width : 1, height: 1 },
                    shadowOpacity: 0.7,
                    width: wp("90%"),
                    backgroundColor: "white"
                }}
            >
                <Image
                    style={{ width: wp("90%"), height: hp("30%") }}
                    source={{
                        uri: `https://picsum.photos/200/300?image=12`
                    }}
                />
                <Text>khkjshkjfhkdjshfkjdshfkjdshkjdhjkhkhkl</Text>
                <Button title={"See the source"} onPress={ () => console.log("todo")}/>
            </View>
        );
    }
}

export default FactCard;