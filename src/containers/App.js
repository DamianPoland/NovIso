import React, { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { auth } from '../shared/fire'

// modules
import Nav from '../components/Nav/Nav'
import Home from '../components/Home/Home'
import Admin from '../components/Admin/Admin'
import Footer from '../components/Footer/Footer'
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy'
import AlertPrivacy from '../UI/AlertPrivacy/AlertPrivacy'

// constans
import { UID, ADMIN, SERIALNUMBER } from '../shared/constans'


function App() {


  // ----------------------- START LOGIN --------------------------//

  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [serialNumber, setSerialNumber] = useState("")

  useEffect(() => {
    auth.onAuthStateChanged(user => {

      // user
      user && setIsLogin(true)
      user && localStorage.setItem(UID, user.uid)

      user?.getIdTokenResult()
        .then(token => {

          // admin
          token.claims.admin && setIsAdmin(true) // save in state
          token.claims.admin && localStorage.setItem(ADMIN, token.claims.admin)

          // serial number
          token.claims.serialNumber && setSerialNumber(token.claims.serialNumber)
          token.claims.serialNumber && localStorage.setItem(SERIALNUMBER, token.claims.serialNumber)
        })

      //remove all if log out
      !user && setIsLogin(false)
      !user && localStorage.removeItem(UID)
      !user && setIsAdmin(false)
      !user && localStorage.removeItem(ADMIN)
      !user && setSerialNumber("")
      !user && localStorage.removeItem(SERIALNUMBER)

    })
  }, [])

  // ----------------------- END LOGIN --------------------------//


  return (
    <BrowserRouter className="App">
      <Nav isLogin={isLogin} isAdmin={isAdmin} />
      <Switch>
        <Route path='/home' render={props => <Home {...props} isLogin={isLogin} />} />
        <Route path='/admin' render={props => <Admin {...props} />} />
        <Route path='/privacy-policy' component={PrivacyPolicy} />
        <Redirect to='/home' />
      </Switch>
      <AlertPrivacy />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
