import React, { useState } from 'react'
import style from './SerialNumber.module.css'


// components
import Spinner from '../../UI/Spinner/Spinner'

//firebase
import { auth, functions } from '../../shared/fire'




const SerialNumber = () => {


    const [showSpinner, setShowSpinner] = useState(false)

    const [serialNumber, setSerialNumber] = useState("")
    const [responseValid, setResponseValid] = useState(false)
    const [serialNumberValidation, setSerialNumberValidation] = useState("")


    const checkInputVallidation = () => {
        if (serialNumber.length < 1) {
            setSerialNumberValidation("Niepoprawny numer")
            return false
        } else {
            setSerialNumberValidation("")
            return true
        }
    }

    const sendSerialNumberToDB = () => {

        // if response is OK then sign out
        if (responseValid) {
            responseValid && auth.signOut()
            return
        }

        if (!checkInputVallidation()) { return }

        setShowSpinner(true)

        const addSerialNumberToUser = functions.httpsCallable('addSerialNumberToUser')
        addSerialNumberToUser({ serialNumber: serialNumber })
            .then(resp => {
                setResponseValid(true)
                setSerialNumberValidation("Poprawnie dodano numer seryjny urządzenia do Twojego konta.\nAby zapisac ustawienia musisz się zalogować ponownie.")
            })
            .catch(err => {
                console.log(err.message)
                setSerialNumberValidation(err.message)
            })
            .finally(() => setShowSpinner(false))

    }

    return (
        <section className={style.number}>

            {showSpinner && <Spinner />}

            {!responseValid && <label className={style.number__label} htmlFor="number">Wpisz numer seryjny urządzenia:</label>}
            {!responseValid && <input className={style.number__input} name="number" onChange={e => setSerialNumber(e.target.value)} />}
            <p
                className={style.number__validation}
                style={{ color: responseValid ? "green" : "red" }}
            > {serialNumberValidation}
            </p>
            <button
                className={style.number__btn}
                onClick={() => sendSerialNumberToDB()}>
                {responseValid ? "Wyloguj" : "Zatwierdź"}
            </button>

        </section>
    )
}

export default SerialNumber
