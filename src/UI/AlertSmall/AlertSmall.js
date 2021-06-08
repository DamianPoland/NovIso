import React, { useEffect } from 'react'
import style from './AlertSmall.module.css'

/* 
komponent do pokazywania wsuwaneg alertu od góry na chwilę i auto chowanie
w props musi się znaleść:
- alertIcon - OPCJONALNIE => główna ikonka (domyślnie iconDone), jeśli informacja to wtedy ustawić aletIcon='info', jeśli error to aletIcon='error'
- description - OPCJONALNIE => główna informacja (domyślnie 'OK')
- animationTime => OPCJONALNIE => czas trwania animacji w sekundach (domyślnie 2s)
- borderColor => OPCJONALNIE => kolor border (domyślnie 'green')
- hide => automatyczna funkcja służy do zamknięcia alertu, będzie wywołana automatycznie po schowaniu alertu
*/

const AlertSmall = ({ alertIcon = 'OK', description = 'OK', hide, animationTime = '2', borderColor = 'green' }) => {

    //call function hide() from props to close alert
    useEffect(() => {
        setTimeout(() => {
            hide()
        }, animationTime * 1000)

    })

    return (
        <div className={style.alertSmall_container} style={{ animationDuration: `${animationTime}s`, borderColor: `${borderColor}` }}>
            <p className={style.alertSmall_description}>{description}</p>
            <div className={style.alertSmall_icon}>
                {alertIcon === 'OK' ? iconDone : null}
                {alertIcon === 'info' ? iconInfo : null}
                {alertIcon === 'error' ? iconError : null}
            </div>

        </div>
    )
}


export default AlertSmall


const iconInfo = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>

const iconDone = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>

const iconError = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M0 0h24v24H0z" fill="none" /><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z" /></svg>