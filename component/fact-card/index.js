//Ceci est notre fichier pour générer notre Fact-Card
//Voici les différents package nécessaires
import React, {Component} from 'react';
//Ici il faut bien récupérer de react-native et non react-native-web
import { View, Image, Button, Text, Linking, ScrollView } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


class FactCard extends Component {

    //Ceci est notre méthode pour faire revenir notre scroll à la position de départ et en définissant une variable qui est scrollView
    gottoTopScrollView = () => {
        this.scrollView.scrollTo({ x :0, y : 0, animated: true })
    }

    //Ici on établil le rendu de notre Fact-Card
    render() {
        return (
            //La balise View ressemble à la balise div
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
                {/*Voici notre image random*/}
                <Image
                    style={{ width: wp("90%"), height: hp("30%") }}
                    source={{
                        uri: this.props.fact.image
                    }}
                />
                {/*Voici notre appel de la scroll pour le text*/}
                <ScrollView
                    ref={scrollViewRef => {this.scrollView = scrollViewRef }}
                    //Nous faisons appel à notre méthode pour le scroll
                    onScrollEndDrag={this.gottoTopScrollView}
                    height={hp("10%")}
                >
                    {/*Ici nous mettons le text et dans notre scrollView*/}
                    <Text style={{ padding : 10 }}>{this.props.fact.text}</Text>
                </ScrollView>
                {/*Voici notre bouton qui nous permet d'aller voir la source du texte*/}
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