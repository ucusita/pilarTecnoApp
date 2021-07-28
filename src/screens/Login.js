import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
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
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         email: '',
    //         password: '',
    //         errorMessage: ''
    //     }
    //     this.handleChange = this.handleChange.bind(this)
    //     this.handleSignIn = this.handleSignIn.bind(this)
    //     this.handleSignUp = this.handleSignUp.bind(this)
    //     this.onGoogleButtonPress = this.onGoogleButtonPress.bind(this)
    //     this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this)
    //     this.handleSignAnonymousGoogle = this.handleSignAnonymousGoogle.bind(this)
    // }

    // const handleChange = (name, value) => ({
    //     this.setState({
    //         [name]: value
    //     })
    // });

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
    const [loading, setLoading] = useState(true);
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
            // Spinner showText={true} />;
    }

    return (
        <div className="login user-select-none">
            <Typography variant="h1" color="secondary" align="center">
                Modulo V App
            </Typography>
            <div className="login__wrapper user-select-none">
                <Typography align="center" variant="h5">
                    {isLogin ? "ENTRADA" : "REGISTRO"}
                </Typography>

                <form
                    className="login__form"
                    onSubmit={handleFormSubmit}
                    autoComplete="off"
                    ref={formRef}
                >
                    {!isLogin && (
                        <div className="login__formGroup">
                            <input
                                type="text"
                                name="name"
                                className="login__formInput"
                                required
                                placeholder="Dime tu nombre"
                                minLength="3"
                            />
                        </div>
                    )}

                    <div className="login__formGroup">
                        <input
                            type="email"
                            name="email"
                            className="login__formInput"
                            required
                            placeholder="Dame tu email"
                        />
                    </div>

                    <div className="login__formGroup">
                        <input
                            type="password"
                            name="password"
                            className="login__formInput"
                            required
                            placeholder="¿y tu clave?"
                            minLength="8"
                        />
                    </div>

                    {!isLogin && (
                        <div className="login__formGroup">
                            <input
                                type="text"
                                name="photoURL"
                                className="login__formInput"
                                placeholder="Imagen de perfil URL (opcional)"
                                minLength="3"
                            />
                        </div>
                    )}

                    <div className="login__formGroup">
                        {err && <Typography color="error"> {err.message} </Typography>}
                    </div>

                    <div className="login__formGroup">
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={loading}
                        >
                            <Typography align="center" variant="subtitle1">
                                {isLogin ? "Entrar" : "Registrarse"}
                            </Typography>
                        </Button>
                    </div>

                    {isLogin && (
                        <Typography align="center" variant="body2">
                            O
                        </Typography>
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
                            value={this.props.email}
                            onChangeText={(email) => this.props.handleChange('email', email)}
                        />
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry
                            placeholder='password'
                            placeholderTextColor='#D7D7D7'
                            value={this.props.password}
                            onChangeText={(password) => this.props.handleChange('password', password)}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.props.handleSignIn}
                        >
                            <Text style={styles.buttonText}>Ingresar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.create}
                            onPress={this.props.handleSignUp}
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
                            onPress={this.props.handleSignInWithGoogle}
                        //onPress={this.props.handleSignInWithGoogle}
                        />
                        <SocialButton
                            buttonTitle="Sign In Annonymous"
                            btnType="user"
                            color="#1e4d41"
                            backgroundColor="#d5e7ea"
                            //onPress={ () => {Alert.alert("Annonymous") }}
                            onPress={this.props.handleSignAnonymousGoogle}
                        //onPress={}
                        />
                        <Text>{this.state.errorMessage}</Text>
                        <Image
                            source={require('../images/wetaxi.png')}
                            style={styles.logo}
                        />

                    </LinearGradient>


                    {/* Sign In With Google  */}
                    <div className="login__formGroup">
                        {isLogin && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={signInWithGoogle}
                            >
                                <Typography align="center" variant="subtitle1">
                                    Entrar con Google
                                </Typography>
                            </Button>
                        )}
                    </div>
                </form>

                {/* Forgot Password Link  */}
                {isLogin && (
                    <Typography align="center" variant="body2">
                        <Link
                            color="secondary"
                            component="button"
                            variant="subtitle2"
                            onClick={() => setOpen(true)}
                        >
                            Olvidé mi clave
                        </Link>
                    </Typography>
                )}

                {/* Already Have an Account  OR  New? Create an Account*/}
                {!isLogin ? (
                    <Typography align="center" variant="body2">
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
                    </Typography>
                ) : (
                    <Typography align="center" variant="body2">
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
                    </Typography>
                )}
            </div>
            {/* ForgotPassword Component (Dialog Box modal) */}
            <ForgotPassword open={open} setOpen={setOpen} />
        </div>
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
