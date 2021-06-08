import React from 'react'
import style from './Alert.module.css'

/* 
komponent do pokazywania Error
w props musi się znaleść:
- alertIcon -OPCJONALNIE => główna ikonka czy to jest błąd(domyślnie) czy może informacja i wtedy ustawić aletIcon='info'
- alertInfo -OPCJONALNIE => główna informacja czy to jest błąd(domyślnie) czy może coś innego np informacja
- alertColor -OPCJONALNIE => ustawienie koloru ramki i alertName, domyślnie jest czerwony
- alertName => główna nazwa alertu
- alertDetails => szczegóły alertu
- click => kliknięcie na cały alert - może służyć do zamknięcia alertu
*/

const Alert = ({ alertIcon = 'error', alertInfo = 'Wystąpił błąd!', alertColor = '#ff0000', alertName, alertDetails, click }) => {


    return (
        <div onClick={click} className={style.container} style={{ borderColor: `${alertColor}` }}>
            <div className={style.alertView}>
                {alertIcon === 'error' && iconError}
                {alertIcon === 'info' && iconInfo}
                {alertIcon === 'OK' && iconOK}
                <p className={style.alertInfo}>{alertInfo}</p>
            </div>
            <div className={style.alert}>
                <p className={style.alertName} style={{ color: `${alertColor}` }}>{alertName}</p>
                <p className={style.alertInfoDetail}>Szczegóły:</p>
                <p className={style.alertDetails}>{alertDetails}</p>
            </div>
            <p className={style.alertClose}>Rozumiem</p>
        </div>
    )
}

export default Alert


const iconError = <svg xmlns="http://www.w3.org/2000/svg" height="3rem" viewBox="0 0 24 24" fill="red" width="3rem"><path d="M0 0h24v24H0z" fill="none" /><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z" /></svg>

const iconInfo = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" width="3rem" height="3rem"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>

const iconOK = <svg viewBox="0 0 24 24" width="3rem" height="3rem" fill="#00ff00"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>

