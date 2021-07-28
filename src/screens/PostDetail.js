import React, {Component} from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {actions} from '../store';
import {connect} from 'react-redux';
import {fetchComments} from '../api';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
//const BASE_URL = 'https://jsonplaceholder.typicode.com/'

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    const {item} = this.props.route.params;
    this.state = {
      id: item.id,
      body: item.body,
      comments: [],
    };
  }

  componentDidMount = () => {
    fetchComments({id: this.state.id}).then(res => {
      console.log('comentarios: ' + JSON.stringify(res[1]));
      this.setState({
        comments: res[1],
      });     
    });    
  };

  keyExtractor = (item, index) => index.toString();
  renderItem = ({item}) => (    
    <View
      style={{
        margin: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        padding: 5,
      }}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>
          {item.email}
        </Text>
        <Divider />
      </View>      
        <View style={styles.bodycontainer}>
          <Text style={styles.text}>
            {item.name}
          </Text>
          <Divider />
        </View>        
        <View style={styles.bodycontainer}>
          <Text style={styles.text}>
            {item.body}
          </Text>
        </View>  
        
    </View>
  );

  _delPost = () => {
    const {item} = this.props.route.params;
    const {id} = item;
    ///VALIDACIONES
    this.props.delPost({id}).then(() => {
      this.props.navigation.goBack();
    });
  };

  render() {
    const {item} = this.props.route.params;
    const {comments} = this.state;
    
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground
          style={{height}}
          source={require('../assets/images/fondo6.jpg')}>
          <View
            style={{
              margin: 20,
              padding: 5,
              marginTop: 20,
            }}>
            <View
              style={{
                marginTop: 50,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 8,
              }}>
              <View style={styles.titlecontainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <Divider />
              <View style={styles.bodycontainer}>
                <Text style={styles.text}>{item.body}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('PostEdit', {item})}
            style={[styles.button]}>
            <Text>Editar Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._delPost()}
            style={[styles.button]}>
            <Text>Borrar Post</Text>
          </TouchableOpacity>
         
          {!comments ? (
            <ActivityIndicator />
          ) : (            
            <View
              style={{
                marginTop: 5,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 8,
                margin: 20,
                padding: 5,
             
              }}>  
              <Text
                style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
                Comentarios
              </Text>
              <Divider />            
               
              <FlatList
                keyExtractor={this.keyExtractor}
                data={comments}                
                renderItem={this.renderItem}
              />
                                
            </View>        
          )}
          
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  titlecontainer: {
    padding: 10,
  },
  bodycontainer: {
    padding: 10,
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
    width: width / 2,
    marginLeft: 90,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
const mapDispatchToProps = dispatch => ({
  delPost: data => dispatch(actions.posts.delPost(data)),
});
const mapStateToProps = state => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
