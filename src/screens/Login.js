import React, { Component } from "react";
import {
    StyleSheet,
    View,
    StatusBar,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import EvilIconsIcon from "react-native-vector-icons/EvilIcons";
import SocialButton from '../components/SocialButtons';
import { GoogleSignin } from '@react-native-community/google-signin';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { actions } from '../store';


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


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            photoURL: '',
            name: '',
            password: '',
        };
    }

    //const {email, photoURL, name, password} = this.state;

    handleSignUp = async () => {
        console.log('SignUpForm');
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

    handleSignIn = async () => {
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

    handleSignInWithGoogle = async () => {
        console.log("Intentando acceder con Google");

        await this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'))

    }

    onGoogleButtonPress = async () => {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
        console.log(idToken);
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }

    handleSignAnonymousGoogle = async () => {
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
        const { email, photoURL, name, loading, password } = this.state;
        return (
            <View style={styles.root}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0)" />
                <View style={styles.background}>
                    <ImageBackground
                        style={styles.rect}
                        imageStyle={styles.rect_imageStyle}
                        source={require('../assets/images/fondo1.jpg')}
                    >
                        <View style={styles.logoColumn}>
                            <View style={styles.logo}>
                                <View style={styles.endWrapperFiller}></View>
                                <View style={styles.text3Column}>
                                    <Text style={styles.text3}>MFR</Text>
                                    <View style={styles.rect7}></View>
                                </View>
                            </View>
                            <View style={styles.form}>
                                <View style={styles.usernameColumn}>
                                    <View style={styles.username}>
                                        <EvilIconsIcon
                                            name="user"
                                            style={styles.icon22}
                                        ></EvilIconsIcon>
                                        <TextInput
                                            placeholder="Username"
                                            placeholderTextColor="rgba(255,255,255,1)"
                                            secureTextEntry={false}
                                            style={styles.usernameInput}
                                            onChangeText={ema => this.setState({ email: ema })}
                                        ></TextInput>
                                    </View>
                                    <View style={styles.password}>
                                        <EvilIconsIcon
                                            name="lock"
                                            style={styles.icon2}
                                        ></EvilIconsIcon>
                                        <TextInput
                                            placeholder="Password"
                                            placeholderTextColor="rgba(255,255,255,1)"
                                            secureTextEntry={false}
                                            style={styles.passwordInput}
                                        ></TextInput>
                                    </View>
                                </View>
                                <View style={styles.usernameColumnFiller}></View>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate("Channels")}
                                    style={styles.button}
                                >
                                    <Text style={styles.text2}>Ingresar</Text>
                                </TouchableOpacity>
                                <SocialButton
                                    buttonTitle="Sign In with Google"
                                    btnType="google"
                                    color="#de4d41"
                                    backgroundColor="#f5e7ea"
                                    onPress={this.handleSignInWithGoogle}
                                />
                                <SocialButton
                                    buttonTitle="Sign In Annonymous"
                                    btnType="user"
                                    color="#1e4d41"
                                    backgroundColor="#d5e7ea"
                                    //onPress={ () => {Alert.alert("Annonymous") }}
                                    onPress={this.handleSignAnonymousGoogle}
                                //onPress={}
                                />
                            </View>
                        </View>
                        <View style={styles.logoColumnFiller}></View>
                        <View style={styles.footerTexts}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Register")}
                                style={styles.button2}
                            >
                                <View style={styles.createAccountFiller}></View>
                                <Text style={styles.createAccount}>Crear Cuenta</Text>
                            </TouchableOpacity>
                            <View style={styles.button2Filler}></View>
                            <Text style={styles.needHelp}>Necesita ayuda?</Text>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        )
    }
}


    const mapDispatchToProps = dispatch => ({
        setUser: (data) =>
            dispatch(actions.user.setUser(data)),
    })
    const mapStateToProps = state => ({
        user: state.user.user
    })

    export default connect(mapStateToProps, mapDispatchToProps)((Login))

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "rgb(255,255,255)"
    },
    background: {
        flex: 1
    },
    rect: {
        flex: 1
    },
    rect_imageStyle: {},
    logo: {
        width: 105,
        height: 131,
        alignSelf: "center"
    },
    endWrapperFiller: {
        flex: 1
    },
    text3: {
        color: "rgba(255,255,255,1)",
        fontSize: 46,
        marginBottom: 4
    },
    rect7: {
        height: 8,
        backgroundColor: "#25cdec",
        marginRight: 4
    },
    text3Column: {
        marginBottom: 6,
        marginLeft: 2,
        marginRight: -1
    },
    form: {
        height: 230,
        marginTop: 59
    },
    username: {
        height: 59,
        backgroundColor: "rgba(251,247,247,0.25)",
        borderRadius: 5,
        flexDirection: "row"
    },
    icon22: {
        color: "rgba(255,255,255,1)",
        fontSize: 30,
        marginLeft: 20,
        alignSelf: "center"
    },
    usernameInput: {
        height: 40,
        color: "rgba(255,255,255,1)",
        flex: 1,
        marginRight: 11,
        marginLeft: 11,
        marginTop: 14
    },
    password: {
        height: 59,
        backgroundColor: "rgba(253,251,251,0.25)",
        borderRadius: 5,
        flexDirection: "row",
        marginTop: 27
    },
    icon2: {
        color: "rgba(255,255,255,1)",
        fontSize: 33,
        marginLeft: 20,
        alignSelf: "center"
    },
    passwordInput: {
        height: 30,
        color: "rgba(255,255,255,1)",
        flex: 1,
        marginRight: 17,
        marginLeft: 8,
        marginTop: 14
    },
    usernameColumn: {},
    usernameColumnFiller: {
        flex: 1
    },
    button: {
        marginTop: 20,
        marginBottom: 10,
        height: 59,
        backgroundColor: "rgba(31,178,204,1)",
        borderRadius: 5,
        justifyContent: "center"
    },
    text2: {
        color: "rgba(255,255,255,1)",
        alignSelf: "center"
    },
    logoColumn: {
        marginTop: 40,
        marginLeft: 41,
        marginRight: 41
    },
    logoColumnFiller: {
        flex: 1
    },
    footerTexts: {
        height: 14,
        flexDirection: "row",
        marginBottom: 36,
        marginLeft: 37,
        marginRight: 36
    },
    button2: {
        width: 104,
        height: 14,
        alignSelf: "flex-end"
    },
    createAccountFiller: {
        flex: 1
    },
    createAccount: {
        color: "rgba(255,255,255,0.5)"
    },
    button2Filler: {
        flex: 1,
        flexDirection: "row"
    },
    needHelp: {
        color: "rgba(255,255,255,0.5)",
        alignSelf: "flex-end",
        marginRight: -1
    }
});

