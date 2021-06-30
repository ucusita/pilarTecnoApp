import React,{ Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


export default class Home extends React.Component {

  _onHomePress = () => {
    Alert.alert(
      "Hola",
      "Ya te encuentras ahí",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }


  render(){
    return( 
    <SafeAreaView style={{flex:1}}>
      <ImageBackground
        style={{height}}
        source={require('../assets/images/fondo6.jpg')}
      >
        <View style={{flexDirection:'column', height, justifyContent:'center'}}>
          <View style={{flexDirection:'row'}}>   
            <TouchableOpacity 
              onPress={()=>this._onHomePress()}
              style={[styles.button, { backgroundColor:'rgba(60, 179, 113, 0.5)' }]}
            >
              <Text style={styles.text}>
                Principal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor:'rgba(238, 0, 238, 0.5)' }]}>
              <Text style={styles.text}>
                Perfil
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', }}>
            <TouchableOpacity style={[styles.button, { backgroundColor:'rgba(255, 165, 0, 0.5)' }]}>
              <Text style={styles.text}>
                Posteos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor:'rgba(0, 165, 188, 0.8)' }]}>
              <Text style={styles.text}>
                Mapa
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ImageBackground>
    </SafeAreaView>
    )}
}

const styles = StyleSheet.create({
  text: {
    fontSize:30, 
    fontWeight:'bold', 
    color:'#fff',
    textAlign:'center'
  },
  button: {
    margin: width/20,
    height:width/2.5,
    width:width/2.5,
    borderRadius:15,
    justifyContent:'center',
    backgroundColor:'#fff',
    zIndex:1
  }
})