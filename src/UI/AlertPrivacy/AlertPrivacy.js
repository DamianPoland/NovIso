import React, { useState, useEffect } from 'react'
import style from './AlertPrivacy.module.css'

/* 
komponent do pokazywania akceptacji privacy policy
Trzeba TYLKO dodać komponent do App.js. Sam się pokaże i ukryje po kliknięciu przycisku a takze zapisze w localStorage info że zaakceptowane
*/

const AlertPrivacy = () => {

    //alert visibility 
    const [isAlertVisible, setIsAlertVisible] = useState(false)
    const alertVisibility = isAlertVisible ? style.containerShow : null

    // privacy policy permission check
    useEffect(() => {
        localStorage.getItem('PRIVACY_POLICY_PERMISSION') ? setIsAlertVisible(false) : setIsAlertVisible(true)
    }, [])

    // function onClick to hide alert
    const hideAlert = () => {
        localStorage.setItem('PRIVACY_POLICY_PERMISSION', true)
        setIsAlertVisible(false)
    }


    return (
        <div className={`${style.container} ${alertVisibility}`}>
            <div className={style.content}>
                <p className={style.text}>Ta strona korzysta z plików cookie oraz Google Analytics, aby dostarczyć nam (w pełni anonimowych) statystyk.<a className={style.anchor} href='/privacy-policy'>Dowiedz się więcej</a> </p>
            </div>
            <button onClick={hideAlert} className={style.button}>Rozumiem</button>
        </div>
    )
}

export default AlertPrivacy
