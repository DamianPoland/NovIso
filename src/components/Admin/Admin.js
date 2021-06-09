import React, { useState, useEffect } from 'react'
import style from './Admin.module.css'
// import axios from 'axios'


//firebase
import { firestore } from '../../shared/fire'

// constans
import { SERIAL } from '../../shared/constans'


const Admin = () => {

    const [serialNumber, setSerialNumber] = useState("")
    const [responseListenerSerialNumbers, setResponseListenerSerialNumbers] = useState([])

    // EFFECT - set live data (snapshot) from serialNumber collection
    useEffect(() => {
        const listenerSerialNumbers = firestore.collection(SERIAL).doc(SERIAL).onSnapshot(
            resp => {

                const respData = resp.data()
                if (!respData || Object.keys(respData).length === 0) { return }
                const respArray = Object.keys(respData).map(key => respData[key])
                setResponseListenerSerialNumbers(respArray)
            },
            err => { console.log("err.message: ", err.message) })

        //cleanup listener
        return () => listenerSerialNumbers()

    }, [])


    const addSerialNumberToDB = () => {

        if (serialNumber.length < 1) { return }

        const objToAdd = {
            serialNumber: serialNumber,
            occupied: false,
            addDate: Date.now(),
        }

        firestore.collection(SERIAL).doc(SERIAL).set({ [serialNumber]: objToAdd }, { merge: true })
            .then(() => {
                console.log(`succes added ${serialNumber}`)
                setSerialNumber("")
            })
            .catch(err => console.log('err', err))
    }


    return (
        <section className={style.admin}>
            <label className={style.admin__label} htmlFor="number">Wpisz numer seryjny urządzenia:</label>
            <input className={style.admin__input} value={serialNumber} name="number" onChange={e => setSerialNumber(e.target.value)} />
            <button className={style.admin__btn} onClick={() => addSerialNumberToDB()}>Dodaj</button>
            {responseListenerSerialNumbers.map(item => {
                return (
                    <div key={item.serialNumber} className={style.admin__itemContainer}>
                        <p className={style.admin__itemSerial}>{item.serialNumber}</p>
                        <p className={style.admin__itemOccupied}>{`${item.occupied}`}</p>
                    </div>
                )
            })}
        </section>
    )
}

export default Admin

