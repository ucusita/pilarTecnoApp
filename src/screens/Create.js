import React, { Component } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const image = { uri: 'https://getwallpapers.com/wallpaper/full/9/9/f/267111.jpg' }

class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            photoURL: '',
            name: '',
            password: '',
        };
    }

    render() {

        const { email, photoURL, name, password } = this.state;

        return (

            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground
                    source={image}
                    style={styles.image}
                >
                    <Text style={styles.text}>Crea tu cuenta</Text>
                    <Input style={styles.input}
                        placeholder='Usuario o Email'
                        leftIcon={<Icon
                            name='user'
                            size={30}
                            color='#008080' />
                        }
                        value={email}
                        onChangeText={em => this.setState({ email: em })}
                    />
                    <Input style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        leftIcon={<Icon
                            name='user'
                            size={30}
                            color='#008080' />}
                        value={password}
                        onChangeText={psw => this.setState({ password: psw })}
                    />
                    <TouchableOpacity style={[styles.buttonSinUp, { backgroundColor: '#2f4f4f' }]}
                        onPress={() => { 
                            auth().createUserWithEmailAndPassword(email, password)
                                .then(() => {
                                    console.log('User account created');
                                    Alert.alert('Cuenta creada!')
                                    this.props.navigation.navigate('Login');
                                })
                                .catch(error => {
                                    if (error.code === 'auth/email-already-in-use') {
                                    Alert.alert('Email existente!');
                                    }
            
                                    if (error.code === 'auth/invalid-email') {
                                    Alert.alert('Email inválido!');
                                    }
                                    console.error(error);
                                });
                        }}
                    >
                        <Text style={styles.textButton}>
                            Registry
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonSinUp, { backgroundColor: '#2f4f4f' }]}
                        onPress={() => { this.props.navigation.goBack() }}>
                        <Text style={styles.textButton}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}

export default Create;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    text: {
        marginTop: 100,
        fontSize: 25,
        fontWeight: 'bold',
        color: `#ff4500`,
        textAlign: 'center',
    },
    textButton: {
        margin: width / 20,
        fontSize: 25,
        color: `#ff4500`,
        textAlign: 'center',
    },
    input: {
        marginTop: 10,
        fontSize: 20,
        color: '#90ee90',
        textAlign: 'left',
        backgroundColor: '#f0ffff',
    },
    buttonSinUp: {
        marginLeft: 60,
        marginRight: 60,
        marginBottom: 70,
        paddingBottom: 3,
        borderRadius: 2,
        justifyContent: 'center',
    },
    googleLog: {
        margin: width / 20,
    }
})