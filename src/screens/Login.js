import React, { Component } from 'react'
import { Text, StyleSheet, Alert, Image } from 'react-native';
import LoginForm from '../components/LoginForm';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import LinearGradient from 'react-native-linear-gradient'

GoogleSignin.hasPlayServices({ autoResolve: true, showPlayServicesUpdateDialog: true }).then(() => {
    console.log('play services are available. can now configure library');
})
.catch((err) => {
      console.log("Play services error", err.code, err.message);
})

GoogleSignin.configure({
    //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '577525055621-v4u476oigev41g3lqfdj6m35rjpqkm4h.apps.googleusercontent.com',
});

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSignIn = this.handleSignIn.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
        this.onGoogleButtonPress = this.onGoogleButtonPress.bind(this)
        this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this)
        this.handleSignAnonymousGoogle = this.handleSignAnonymousGoogle.bind(this)
    }

    handleChange(name, value) {
        this.setState({
            [name]: value
        })
    }

    async handleSignUp() {
        console.log('SignUpForm')
        try {
            const { email, password } = this.state
            await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('User account created and signed in!');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert('That email address is invalid!');
                    }

                    console.error(error);
                });
        } catch (error) {
            console.log(error)
        }
    }

    async handleSignIn() {
        console.log("Intentando acceder por email y password");
        try {
            const { email, password } = this.state
            await auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('User account signed in!');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert('That email address is invalid!');
                    }

                    console.error(error);
                });

            // if (result.data.token) {
            //     this.props.handleChange('token', result.data.token)
            // } else {
            //     Alert.alert('', result.data)
            // }

        } catch (error) {
            console.log(error)
        }
    }

    async handleSignInWithGoogle() {
        console.log("Intentando acceder con Google");
        
        await this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'))

    }

    async onGoogleButtonPress() {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
        console.log(idToken);
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }

    async handleSignAnonymousGoogle() {
        console.log("Intentando acceder anónimamente");
        await auth()
            .signInAnonymously()
            .then(() => {
                console.log('User signed in anonymously');
            })
            .catch(error => {
                if (error.code === 'auth/operation-not-allowed') {
                    console.log('Enable anonymous in your firebase console.');
                }

                console.error(error);
            });
    }

    render() {
        console.log('Login screen');
        return (
            <LinearGradient
                colors={['#4D54DF', '#9C55BB']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.headerText}>Mod V </Text>
                <LoginForm
                    email={this.state.email}
                    password={this.state.password}
                    handleChange={this.handleChange}
                    handleSignIn={this.handleSignIn}
                    handleSignUp={this.handleSignUp}
                    handleSignInWithGoogle={this.handleSignInWithGoogle}
                    handleSignAnonymousGoogle={this.handleSignAnonymousGoogle}
                />
                <Text>{this.state.errorMessage}</Text>
                <Image
                    source={require('../images/wetaxi.png')}
                    style={styles.logo}
                />

            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        fontSize: 44,
        color: '#FFF',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 30
    },
    errorMessage: {
        marginHorizontal: 10,
        fontSize: 18,
        color: '#fff'
    },
    logo: {
        //flex: 1,
        marginTop: 100,
        height: 100,
        width: 100,
        alignSelf: 'center',
    }
});
