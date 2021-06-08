import React, { useState, useEffect } from 'react'
import style from './Admin.module.css'
import axios from 'axios'


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





    const callApi = () => {



        // PUT error bariera zablokowana => OK
        // axios.post("https://us-central1-novisopl.cloudfunctions.net/novisoErrorBarieraZablokowana", { adminDamianGmail: true })
        //     .then(resp =>  console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response.data) )



        // GET all users setings for today => OK
        // axios.get("https://us-central1-novisopl.cloudfunctions.net/novisoGetManualForToday")
        //     .then(resp => console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response.data))



        // PUT one user setings for today  => OK
        // const requestObject = {
        //     adminDamianGmail: {
        //         brown: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: false },
        //         black: { isColorOpen: true, isNoBucketError: false, isRequestChangeColorWaiting: false },
        //         yellow: { isColorOpen: false, isNoBucketError: true, isRequestChangeColorWaiting: true },
        //         blue: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
        //         green: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
        //     }
        // }
        // axios.put("https://us-central1-novisopl.cloudfunctions.net/novisoPutManualForToday", requestObject)
        //     .then(resp => console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response?.data))



        // GET array of all collections with serial numbers, return array of all serial numbers in DB
        // axios.get("https://us-central1-novisopl.cloudfunctions.net/novisoGetAllCalendarCollections")
        //     .then(resp => console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response?.data))



        // GET one user calendar 2 month data, serial number in query
        // axios.get("https://us-central1-novisopl.cloudfunctions.net/novisoGetMonthCalendarUserData?userSerialNumber=adminDamianGmail")
        //     .then(resp => console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response?.data))


        // PUT today calendar user data
        // const requestObj = {
        //     adminDamianGmail: {
        //         brown: { isGarbageAdded: true, isGarbageTaken: false },
        //         black: { isGarbageAdded: true, isGarbageTaken: true },
        //         yellow: { isGarbageAdded: true, isGarbageTaken: true },
        //         blue: { isGarbageAdded: true, isGarbageTaken: true },
        //         green: { isGarbageAdded: true, isGarbageTaken: true },
        //     }
        // }
        // axios.put("https://us-central1-novisopl.cloudfunctions.net/novisoPutTodayCalendarUserData", requestObj)
        //     .then(resp => console.log("resp: ", resp))
        //     .catch(err => console.log("err.response.data: ", err.response?.data))


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

            <button onClick={callApi}>Call API</button>
        </section>
    )
}

export default Admin

