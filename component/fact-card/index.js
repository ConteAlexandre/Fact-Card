import React, {Component} from 'react';
import { View, Image, Button, Text, Linking } from "react-native"
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
                        uri: this.props.fact.image
                    }}
                />
                <Text>{this.props.fact.text}</Text>
                <Button
                    disabled={this.props.disabled}
                    title={"See the source"}
                    onPress={ () => Linking.openURL(this.props.fact.source_url)}
                />
            </View>
        );
    }
}

export default FactCard;