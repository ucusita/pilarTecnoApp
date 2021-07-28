import React, { Component } from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  View,
  ImageBackground
} from 'react-native';
import { Button, Divider } from 'react-native-elements'
import { actions } from '../store'
import { connect } from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
    }



  }
  componentDidMount = () => {
    this.props.getPosts()
  }
  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() =>
      this.props.navigation.navigate('PostDetail', { item })} >
      <View style={{
        margin: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8,
        padding: 5
      }}>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>
            {item.title}
          </Text>
        </View>
        <Divider />
        <View style={styles.bodycontainer}>
          <Text style={styles.text}>
            {item.body}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
  render() {
    return (
      <SafeAreaView style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white'
      }}>
        {
          !this.props.posts ?
            <ActivityIndicator />
            :
            <ImageBackground
              style={{ height, width, paddingTop: height / 9 }}
              source={require('../assets/images/fondo6.jpg')}
            >
              <View style={{ flex: 1 }}>
                <Button title='Crear Nuevo Post'
                  onPress={() => this.props.navigation.navigate('PostCreate')} />
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.props.posts}
                  renderItem={this.renderItem}
                />
              </View>
            </ImageBackground>
        }
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  titlecontainer: {
    padding: 10
  },
  bodycontainer: {
    padding: 10
  },
  content: {
    margin: width / 20,
    height: width / 2.5,
    width: width / 2.5,
    borderRadius: 15,
    justifyContent: 'center',
  }
})
const mapDispatchToProps = dispatch => ({
  getPosts: () =>
    dispatch(actions.posts.getPosts()),
})
const mapStateToProps = state => ({
  posts: state.posts.posts,
})
export default connect(mapStateToProps, mapDispatchToProps)((Posts))