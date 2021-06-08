import React from 'react'
import firebase from "firebase/app" // a.d. 2
import FirebaseUIAuth from "react-firebaseui-localized" // a.d. 2
import { auth } from '../../shared/fire'//a.d. 3
import './firebaseui-overrides.global.css' // import style


//components
import { ReactComponent as Login } from '../../assets/login.svg'

/*
https://github.com/firebase/firebaseui-web - tu jest całość firebase UI
https://github.com/firebase/firebaseui-web-react - tu jest całość firebase UI dla Reacta
https://www.npmjs.com/package/react-firebaseui-localized 

Komponent gotowy do użycia. Rejestracja i logowanie w jednym
TODO:
1. Ustawić w konsoli firebase auth metody logowania
2. Zainstalować dependency: npm i react-firebaseui-localized (ma dodany język) => koniecznie dodać version w tagu
3. Dodać firebase do projektu wg punktu 1 z mojego opisu z Firebase i importować auth
4. Zdjęcie można zmienić
5. W projekcie na początku trzeba dodać:
    a. listenera: auth.onAuthStateChanged(user => user ? console.log('zalogowany: ', user) : console.log('user Sign Out'))
    b. do wylogowywania: auth.signOut()
*/


// Configure FirebaseUI
const uiConfig = {
    signInFlow: 'popup', // popup to wyskakujące okienko, można to usunąć i będzie w tym samym oknie otwierać logowanie
    signInSuccessUrl: '/home', // przekierowanie na podaną stronę po zalogowaniu
    signInOptions: [ //usunąć to co nie jest udostępnione
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // {
        //     provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        //     defaultCountry: 'PL', // default country phone
        // }
    ],
    // tosUrl: '/regulations', // przekierowanie do terms of service - można usunąć i nie będzie sie wyświetlał napis
    // privacyPolicyUrl: '/privacy-policy' // przekierowanie do privacy policy - można usunąć i nie będzie sie wyświetlał napis
};


class Login_Register_Firebase_UI extends React.Component {

    render() {
        return (
            <section className='login_regiter_UI_background'>
                <div className='login_regiter_UI_container'>
                    <div className='login_regiter_UI_log'>
                        <h1 className='login_regiter_UI_log__text'>Zaloguj się lub zarejestruj.</h1>
                        <FirebaseUIAuth
                            lang='pl'
                            config={uiConfig}
                            version="4.8.0"
                            auth={auth}
                            firebase={firebase}
                        />
                    </div>
                    <div className="login_regiter_UI_imgContainer">
                        <Login />
                    </div>
                </div>
            </section>
        )

    }
}

export default Login_Register_Firebase_UI
