import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Link, Text, StyleSheet, Button, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { material } from 'react-native-typography'
import { useDispatch } from "react-redux";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import LinearGradient from 'react-native-linear-gradient'
import SocialButton from '../components/SocialButtons';
import { loginUser } from "../store/actions/authActions";

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

function Login() {

    // const handleChange = (name, value) => {
    //     this.setState({
    //         [name]: value
    //     })
    // };

    const handleSignUp = async () => {
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
    };

    const handleSignIn = async () => {
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

    const handleSignInWithGoogle = async () => {
        console.log("Intentando acceder con Google");

        await this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'))

    }

    const onGoogleButtonPress = async () => {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
        console.log(idToken);
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }

    const handleSignAnonymousGoogle = async () => {
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


    const [isLogin, setIsLogin] = useState(true); // to keep track of whether the user is trying to login or Signup
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const formRef = useRef();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false); // To handle ForgotPassword Component  

    // Setting Up a Listener, that will keep listening for AuthChange events
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            // If the authChange gives the logged in user,
            if (authUser) {
                const user = {
                    uid: authUser.uid,
                    email: authUser.email,
                    displayName: authUser.displayName,
                    photoURL: authUser.photoURL,
                };
                dispatch(loginUser(user));
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    // EveryTime User switches between Login and Sign Up reset all the InputFields
    useEffect(() => {
        if (loading) return;
        formRef.current.email.value = "";
        formRef.current.password.value = "";
        setErr(null); // reset the error State
    }, [isLogin, loading]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = {
            email: formRef.current.email.value,
            password: formRef.current.password.value,
        };

        try {
            if (isLogin) {
                // If the User is trying to Log In
                await signIn(data.email, data.password);
            } else {
                // If the User is trying to Sign UP
                data.name = formRef.current.name.value;
                data.photoURL = formRef.current.photoURL.value;
                const userAuth = await signUp(data.email, data.password);
                console.log(userAuth.user);
                await updateProfile(userAuth, data.name, data.photoURL);
            }
        } catch (error) {
            setErr(error);
            formRef.current.password.value = "";
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View className="login user-select-none">
            <Text style={material.headline} align="center">
                Modulo V App
            </Text>
            <View className="login__wrapper user-select-none">
                <Text style={material.subheading} align="center">
                    {isLogin ? "ENTRADA" : "REGISTRO"}
                </Text>

                <form
                    className="login__form"
                    onSubmit={handleFormSubmit}
                    autoComplete="off"
                    ref={formRef}
                >
                    {!isLogin && (
                        <View className="login__formGroup">
                            <TextInput
                                type="text"
                                name="name"
                                className="login__formInput"
                                required
                                placeholder="Dime tu nombre"
                                minLength="3"
                            />
                        </View>
                    )}

                    <LinearGradient
                        colors={['#4D54DF', '#9C55BB']}
                        style={styles.container}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.headerText}>Mod V </Text>
                        <TextInput
                            style={styles.input}
                            placeholder='su@email.com'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            placeholderTextColor='#D1D1D1'
                            // value={this.props.email}
                            onChangeText={(email) => handleChange('email', email)}
                        />
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry
                            placeholder='password'
                            placeholderTextColor='#D7D7D7'
                            // value={this.props.password}
                            onChangeText={(password) => handleChange('password', password)}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignIn}
                        >
                            <Text style={styles.buttonText}>Ingresar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.create}
                            onPress={handleSignUp}
                        >
                            <Text style={styles.create}>Crear cuenta</Text>
                        </TouchableOpacity>
                        <SocialButton
                            buttonTitle="Sign In with Facebook"
                            btnType="facebook"
                            color="#4867aa"
                            backgroundColor="#e6eaf4"
                            //onPress={this.props.handleSignInWithFacebook}
                            onPress={() => { Alert.alert("Facebook") }}
                        />
                        <SocialButton
                            buttonTitle="Sign In with Google"
                            btnType="google"
                            color="#de4d41"
                            backgroundColor="#f5e7ea"
                            onPress={handleSignInWithGoogle}
                        />
                        <SocialButton
                            buttonTitle="Sign In Annonymous"
                            btnType="user"
                            color="#1e4d41"
                            backgroundColor="#d5e7ea"
                            //onPress={ () => {Alert.alert("Annonymous") }}
                            onPress={handleSignAnonymousGoogle}
                        //onPress={}
                        />
                        {/* <Text>{this.state.errorMessage}</Text> */}
                        <Image
                            source={require('../images/wetaxi.png')}
                            style={styles.logo}
                        />

                    </LinearGradient>

                    <View className="login__formGroup">
                        {err && <Text style={material.body2} color="#ff0000"> {err.message} </Text>}
                    </View>

                    <TouchableOpacity
                        type="submit"
                        onPress={() => props.navigation.navigate("Channels")}
                        style={styles.button}
                        disabled={loading}
                    >
                        <Text style={material.subheading} align="center">
                                {isLogin ? "Entrar" : "Registrarse"}
                            </Text>
                    </TouchableOpacity>

                    

                    {isLogin && (
                        <Text style={material.body2} align="center">
                            O
                        </Text>
                    )}





                    {/* Sign In With Google  */}
                    {/* <View className="login__formGroup">
                        {isLogin && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleSignInWithGoogle}
                            >
                                <Text style={material.subheadingWhite} align="center">
                                    Entrar con Google
                                </Text>
                            </Button>
                        )}
                    </View> */}
                </form>

                {/* Forgot Password Link  */}
                {isLogin && (
                    <Text style={material.body2} align="center">
                        <Link
                            color="secondary"
                            component="button"
                            variant="subtitle2"
                            onClick={() => setOpen(true)}
                        >
                            Olvidé mi clave
                        </Link>
                    </Text>
                )}

                {/* Already Have an Account  OR  New? Create an Account*/}
                {!isLogin ? (
                    <Text style={material.body2} align="center">
                        {" "}
                        Ya tengo una cuenta &nbsp;
                        <Link
                            component="button"
                            color="secondary"
                            variant="subtitle2"
                            onClick={() => setIsLogin(true)}
                        >
                            Entrada
                        </Link>
                    </Text>
                ) : (
                    <Text style={material.body2} align="center">
                        {" "}
                        Nuevo? Crea una Cuenta &nbsp;
                        <Link
                            component="button"
                            color="secondary"
                            variant="subtitle2"
                            onClick={() => setIsLogin(false)}
                        >
                            Aquí
                        </Link>
                    </Text>
                )}
            </View>
            {/* ForgotPassword Component (Dialog Box modal) */}
            {/* <ForgotPassword open={open} setOpen={setOpen} /> */}
        </View>
    );
}


// function Login() {
//     constructor(props) {
//         super(props)
//         this.state = {
//             email: '',
//             password: '',
//             errorMessage: ''
//         }
//         this.handleChange = this.handleChange.bind(this)
//         this.handleSignIn = this.handleSignIn.bind(this)
//         this.handleSignUp = this.handleSignUp.bind(this)
//         this.onGoogleButtonPress = this.onGoogleButtonPress.bind(this)
//         this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this)
//         this.handleSignAnonymousGoogle = this.handleSignAnonymousGoogle.bind(this)
//     }

//     handleChange(name, value) {
//         this.setState({
//             [name]: value
//         })
//     }

//     async handleSignUp() {
//         console.log('SignUpForm')
//         try {
//             const { email, password } = this.state
//             await auth()
//                 .createUserWithEmailAndPassword(email, password)
//                 .then(() => {
//                     console.log('User account created and signed in!');
//                 })
//                 .catch(error => {
//                     if (error.code === 'auth/email-already-in-use') {
//                         alert('That email address is already in use!');
//                     }

//                     if (error.code === 'auth/invalid-email') {
//                         alert('That email address is invalid!');
//                     }

//                     console.error(error);
//                 });
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async handleSignIn() {
//         console.log("Intentando acceder por email y password");
//         try {
//             const { email, password } = this.state
//             await auth()
//                 .signInWithEmailAndPassword(email, password)
//                 .then(() => {
//                     console.log('User account signed in!');
//                 })
//                 .catch(error => {
//                     if (error.code === 'auth/email-already-in-use') {
//                         alert('That email address is already in use!');
//                     }

//                     if (error.code === 'auth/invalid-email') {
//                         alert('That email address is invalid!');
//                     }

//                     console.error(error);
//                 });

//             // if (result.data.token) {
//             //     this.props.handleChange('token', result.data.token)
//             // } else {
//             //     Alert.alert('', result.data)
//             // }

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async handleSignInWithGoogle() {
//         console.log("Intentando acceder con Google");

//         await this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'))

//     }

//     async onGoogleButtonPress() {
//         // Get the users ID token
//         const { idToken } = await GoogleSignin.signIn();
//         console.log(idToken);
//         // Create a Google credential with the token
//         const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//         // Sign-in the user with the credential
//         return auth().signInWithCredential(googleCredential);
//     }

//     async handleSignAnonymousGoogle() {
//         console.log("Intentando acceder anónimamente");
//         await auth()
//             .signInAnonymously()
//             .then(() => {
//                 console.log('User signed in anonymously');
//             })
//             .catch(error => {
//                 if (error.code === 'auth/operation-not-allowed') {
//                     console.log('Enable anonymous in your firebase console.');
//                 }

//                 console.error(error);
//             });
//     }

//     render() {
//         console.log('Login screen');
//         return (
//             <LinearGradient
//                 colors={['#4D54DF', '#9C55BB']}
//                 style={styles.container}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//             >
//                 <Text style={styles.headerText}>Mod V </Text>
//                 <LoginForm
//                     email={this.state.email}
//                     password={this.state.password}
//                     handleChange={this.handleChange}
//                     handleSignIn={this.handleSignIn}
//                     handleSignUp={this.handleSignUp}
//                     handleSignInWithGoogle={this.handleSignInWithGoogle}
//                     handleSignAnonymousGoogle={this.handleSignAnonymousGoogle}
//                 />
//                 <Text>{this.state.errorMessage}</Text>
//                 <Image
//                     source={require('../images/wetaxi.png')}
//                     style={styles.logo}
//                 />

//             </LinearGradient>
//         )
//     }
// }
export default Login;

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
