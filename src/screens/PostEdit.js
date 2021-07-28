import React, { Component } from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text
} from 'react-native';
import { Input, Button } from 'react-native-elements'
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { connect } from 'react-redux'
import { actions } from '../store'
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: ''
    }
  }

  componentDidMount = () => {
    const {item} = this.props.route.params;
    if ({item}){
      this.setState({title: item.title, body: item.body})
    }
    
  }

  _updatePost = () => {
    const { title, body } = this.state;
    const {item} = this.props.route.params;
    const {id} = item;
    ///VALIDACIONES
    this.props.updatePost({title, body, id}).then(() => {
      //this.props.navigation.navigate('Posts') Tambien funciona con esta linea
      this.props.navigation.popToTop()
    })
  }
  render() {
    
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground
          style={[styles.content, { height, width }]}
          source={require('../assets/images/fondo6.jpg')}
        >
          <Input
           
            inputContainerStyle={{
              width: width * 0.8, alignItems: 'flex-start',
              alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)', pading: 15
            }}
            inputStyle={{ color: 'white', marginLeft: 15 }}
            placeholderTextColor='#ccc'
            value={this.state.title}
            onChangeText={(value) => this.setState({ title: value })}
          />
          <Input
            
            inputContainerStyle={{
              width: width * 0.8, alignItems: 'flex-start',
              alignSelf: 'center', height: height * 0.4, backgroundColor: 'rgba(0,0,0,0.5)',
              pading: 15
            }}
            inputStyle={{ color: 'white', marginLeft: 15 }}
            placeholderTextColor='#ccc'
            value={this.state.body}
            onChangeText={(value) => this.setState({ body: value })}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity
                onPress={() => this._updatePost()}
                style={[
                  styles.button,                 
                ]}
                >
                <Text>Actualizar Post</Text>
          </TouchableOpacity>
          
        </ImageBackground>
        {/* </View> */}
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    // color:'#fff',
    textAlign: 'center'
  },
  content: {
    margin: width / 20,
    height: width / 2.5,
    width: width / 2.5,
    borderRadius: 15,
    justifyContent: 'center',
   
  },
  button: {
    backgroundColor: 'rgba(165, 105, 189, 0.5)',
    margin: width / 20,
    width: width/2,
    marginLeft: 90,    
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})
const mapDispatchToProps = dispatch => ({
  updatePost: (data) =>
    dispatch(actions.posts.updatePost(data)),
})
const mapStateToProps = state => ({
 
})
export default connect(mapStateToProps, mapDispatchToProps)((PostEdit))