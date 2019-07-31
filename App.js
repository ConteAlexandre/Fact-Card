//Voici le fichier qui est lu quand on utilise l'appli
//appelons les packages qui nous seront utiles
import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
//Nous appelons ici notre composant Fact-card
import FactCard from "./component/fact-card";
//Ca package permet de donner un % par rapport à la taille de l'écran du tel ce qui nous permet une responsivité
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import axios from "axios";

//Nous définisssons toutes nos constantes qu'on réutilise derrière
const MAX_LEFT_ROTATION_DISTANCE = wp("-150%")
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%")
const LEFT_TRESHOLD_BEFORE_SWIPE = wp("-50%");
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%");
const FACT_URL = "http://randomuselessfact.appspot.com/random.json?language=en"
const RANDOM_IMAGE_URL = "https://picsum.photos/200/300?image="

class App extends Component {

    constructor(props) {
        super(props);

        //On établit des états
        this.state = { panResponder: undefined, topFact : undefined, bottomFact : undefined }

        //On dit que this.position est une nouvelle animation avec des valeurs XY
        this.position = new Animated.ValueXY();
    }

    //Ici on établit ce qui se passe a chaque appel d'un composant
    componentDidMount() {

        //On définit un constante pour mettre des règles sur notre Fact-Card
        const panResponder = PanResponder.create({

            //On désactive le fait que l'image tourne si le scroll est activé
            onMoveShouldSetPanResponder: (e, gesture) => {
                return Math.abs(gesture.dx) > Math.abs(gesture.dy*3)
            },

            //On dit que lorqu'une pression sur l'ecran est ressenti alors x prend le mouvement du doigt comme valeur mais y ne bouge pas
            onPanResponderMove: (event,gesture) => {
                this.position.setValue({
                    x : gesture.dx,
                    y : 0
                })
            },

            //ici on étblit les évènement qui se passe selon certaines conditions
            onPanResponderRelease: (event, gesture) => {

                //SI l'axe x est un inférieur à une valeur alors on fait quitter la Fact-Card
                if (gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceLeftEXit();

                    //Même chose mais pour la droite donc supérieur
                }else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceRightExit();

                    //Sinon on remet la Fact-Card à sa place initiale
                }else {
                    this.resetPositionSoft();
                }
            }
        })

        //On modifie notre état et nous permet de générer deux images
        this.setState({panResponder}, () => {

            //Ici on charge notre image du top donc la première avec un texte random
            axios.get(FACT_URL).then(response => {
                this.setState({
                    //On fait en sorte que notre état topFact récupère les données
                    topFact : {
                        ...response.data,
                        image : this.getRandomImageUrl()
                    }
                })
            })

            //Ici on charge notre image situé en dessous
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

    //Méthode qui nous fait aller chercher une image random
    getRandomImageUrl() {
        return `${RANDOM_IMAGE_URL}${Math.floor(Math.random()*500+1)}`
    }

    //Ici on fait une fonction qui interchange les images
    onCardExitDown =() => {
        this.setState({

            //On di que notre image top devient celle qui est en dessous
            topFact: this.state.bottomFact
        })

        //Puis on recharge une image bottom
        this.loadBottomFact();

        //Qui prend les valeurs initiales
        this.position.setValue({
            x : 0,
            y : 0
        })
    }

    //Méthode qui force la Fact-Card a prtir quand on slide sur la gauche
    forceLeftEXit() {
        Animated.timing(this.position, {
            toValue: { x : wp("-100%"), y : 0 }
        }).start(this.onCardExitDown)
    }

    //Méthode qui force la Fact-Card a prtir quand on slide sur la droite
    forceRightExit() {
        Animated.timing(this.position, {
            toValue: { x : wp("100%"), y : 0 }
        }).start(this.onCardExitDown)
    }

    //Méthode qui fait revenir notre Fact-Card si elle ne quitte pas l'écran
    resetPositionSoft() {
        Animated.spring(this.position, {
            toValue: { x :0, y : 0 }
        }).start()
    }

    //Méthode qui nous permet de faire la réaction de la Fact-Card losrque l'on fait une pression dessus et qu'on la dépkace
    getCardStyles() {

        //Ici on initalise une rotation
        const rotation = this.position.x.interpolate({
            inputRange : [MAX_LEFT_ROTATION_DISTANCE, 0, MAX_RIGHT_ROTATION_DISTANCE],
            outputRange: ["-120deg", "0deg", "120deg"]
        })
        return {
            transform: [{rotate : rotation }],
            ...this.position.getLayout()
        }
    }

    //voici le rendu de notre Fact-Card au top
    renderTopCard() {
        return (

            //On dit que c'est une vue qui va être animé
            <Animated.View

                //On lui donne le style établi plus haut
                style={this.getCardStyles()}
                {...this.state.panResponder.panHandlers}
            >

                {/*On établit des propriétées le disabled pour dire que le bouton est activé et fact pour précise d'où viennent les données*/}
                <FactCard disabled={false} fact={this.state.topFact}/>
            </Animated.View>
        )
    }

    //voici le rendu de notre Fact-Card au bottom
    renderBottomCard() {
        return (

            //Ici vu que c'est l'image du dessous on lui donne aucune animation et on lui dit de se mettre en dessous avec le style
            <View style={{zIndex: -1, position: "absolute"}}>

                {/*on met le disabled en true car le bouton doit être désactivé et fact pour aller cherche les propriétées qui sont dans l'étatbottomFact*/}
                <FactCard disabled={true} fact={this.state.bottomFact}/>
            </View>
        )
    }

    //Ici on a le rendu global de notre Appli sur le tel
    render() {
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

//On a mis certains styles à part pour que cela soit plus simple
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
