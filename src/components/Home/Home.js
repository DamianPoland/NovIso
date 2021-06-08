import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import { firestore, functions } from '../../shared/fire'

// components
import LoginRegisterFirebaseUI from '../LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import SerialNumber from '../SerialNumber/SerialNumber'
import AlertSmall from '../../UI/AlertSmall/AlertSmall'
import Spinner from '../../UI/Spinner/Spinner'
import Alert from '../../UI/Alert/Alert'
import Switch from "react-switch";

// calendar
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../../shared/Calendar.css'

// constans
import { UID, SERIALNUMBER, MANUAL, ERROR } from '../../shared/constans'

// svg img
import { ReactComponent as Warning } from '../../assets/warning.svg'


const colorsArray = [
    { brown: "bioodpady" },
    { black: "odpady zmieszane" },
    { yellow: "metale i plastiki" },
    { blue: "papier" },
    { green: "szkło" },
]


const docNameToday = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` // get today date in format yyyy-m-dd



const Home = ({ isLogin }) => {

    const [isLoginHandler, setIsLoginHandler] = useState(localStorage.getItem(UID))
    const [serialNumber,] = useState(localStorage.getItem(SERIALNUMBER))


    const [showSpinner, setShowSpinner] = useState(false)
    const [showAlertCalendarError, setShowAlertCalendarError] = useState(false)
    const [showAlertSmall, setShowAlertSmall] = useState(false)



    // STATE - displayed month
    const [displayedMonth, setDisplayedMonth] = useState(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`) // default today, show today year and month in code: "2020-12" like in DB

    // STATE - loaded days for month from DB
    const [loadedMonth, setLoadededMonth] = useState({})

    // STATE - displayed day
    const [displayedDay, setDisplayedDay] = useState()

    //STATE loaded today day from calendar
    const [loadededTodayFromCalendar, setLoadededTodayFromCalendar] = useState({})



    // STATE - today error blocked when "Bariera zablokowana"
    const [todayErrorBlocked, setTodayErrorBlocked] = useState(false)

    // STATE - today colors
    const [todayColors, setTodayColors] = useState({})


    // STATE - update one day lights in callendar (callendar settings)
    const [dayColorsInCalendar, setDayColorsInCalendar] = useState({
        brown: { isGarbageAdded: false, isGarbageTaken: false },
        black: { isGarbageAdded: false, isGarbageTaken: false },
        yellow: { isGarbageAdded: false, isGarbageTaken: false },
        blue: { isGarbageAdded: false, isGarbageTaken: false },
        green: { isGarbageAdded: false, isGarbageTaken: false },
    })


    // reload comonent after log out or after add key
    useEffect(() => { setIsLoginHandler(localStorage.getItem(UID)) }, [isLogin])


    // set live data (snapshot) for today from calendar
    useEffect(() => {

        if (!serialNumber) { return }

        const docNameTodayYearMonth = `${docNameToday.split("-")[0]}-${docNameToday.split("-")[1]}`

        const listenerTodayFromCalendar = firestore.collection(serialNumber).doc(docNameTodayYearMonth).onSnapshot(
            resp => {

                // return when document not exist or exist in DB but has no data
                if (!resp.data() || Object.keys(resp.data()).length === 0 || !resp.data()[docNameToday]) {
                    setLoadededTodayFromCalendar({})
                    return
                }

                console.log("loadededTodayFromCalendar: ", resp.data()[docNameToday]);
                // save today day from callendar
                setLoadededTodayFromCalendar(resp.data()[docNameToday])

            },
            err => console.log("listenerTodayFromCalendar: ", listenerTodayFromCalendar))
        //cleanup listener
        return () => listenerTodayFromCalendar()

        // eslint-disable-next-line
    }, [])


    // set live data (snapshot) from today error blocked "Bariera zablokowana"
    useEffect(() => {

        if (!serialNumber) { return }

        const listenerErrorBlocked = firestore.collection(ERROR).doc(ERROR).onSnapshot(
            resp => {

                // return when document not exist or exist in DB but has no data
                if (!resp.data() || Object.keys(resp.data()).length === 0) { return }

                console.log("listenerErrorBlocked: ", resp.data()[serialNumber]);

                // save list of all days in month to state
                setTodayErrorBlocked(resp.data()[serialNumber])

            },
            err => { console.log("err.message: ", err.message) })

        //cleanup listener
        return () => listenerErrorBlocked()
        // eslint-disable-next-line
    }, [])


    // set live data (snapshot) from today colors
    useEffect(() => {

        if (!serialNumber) { return }

        const listenerTodaycolors = firestore.collection(MANUAL).doc(docNameToday).onSnapshot(
            resp => {

                // return when document not exist or exist in DB but has no data
                if (!resp.data() || Object.keys(resp.data()).length === 0) {
                    setTodayColors({})
                    return
                }

                // return when document not exist or exist in DB but has no data
                if (!resp.data()[serialNumber] || Object.keys(resp.data()[serialNumber]).length === 0) {
                    setTodayColors({})
                    return
                }

                console.log("listenerTodaycolors: ", resp.data()[serialNumber]);

                // save list of all days in month to state
                setTodayColors(resp.data()[serialNumber])

            },
            err => { console.log("err.message: ", err.message) })

        //cleanup listener
        return () => listenerTodaycolors()
        // eslint-disable-next-line
    }, [])

    // set live data (snapshot) for displayedMonth collection
    useEffect(() => {

        if (!serialNumber) { return }

        resetDayColorsInCalendar()

        setShowSpinner(true)

        const listenerMonth = firestore.collection(serialNumber).doc(displayedMonth).onSnapshot(
            resp => {

                //hide spinner
                setShowSpinner(false)

                // return when document not exist or exist in DB but has no data
                if (!resp.data() || Object.keys(resp.data()).length === 0) {
                    setLoadededMonth({})
                    return
                }

                console.log("resp.data(): ", resp.data())

                // save list of all days in month with colors to state
                setLoadededMonth(resp.data())

            },
            err => {

                //hide spinner
                setShowSpinner(false)

                // show alert
                setShowAlertCalendarError({ name: "", details: err.message })
            })
        //cleanup listener
        return () => listenerMonth()

        // eslint-disable-next-line
    }, [displayedMonth])



    // call when displayed month change, call from callendar
    const handlerActiveDateChange = ({ activeStartDate, value, view }) => {
        setDisplayedMonth(`${activeStartDate.getFullYear()}-${activeStartDate.getMonth() + 1}`)
        setDisplayedDay()
        resetDayColorsInCalendar()
    }


    // update one day lights in calendar
    const sendDayColorsInCalendarToDB = () => {

        if (!displayedDay) { return }

        firestore.collection(serialNumber).doc(displayedMonth).set({ [`${displayedMonth}-${displayedDay}`]: dayColorsInCalendar }, { merge: true })
            .then(() => { console.log('success set documents') })
            .catch(err => console.log('err', err))
    }


    // function to add color to evey day, if is no data add null, auto call from callendar
    const handlerTileContent = ({ date }) => {

        if (date.getFullYear() !== +displayedMonth.split("-")[0]) { return } // check is current year
        if ((date.getMonth() + 1) !== +displayedMonth.split("-")[1]) { return } // check is current month

        const day = loadedMonth[`${displayedMonth}-${+date.getDate()}`] // get current day from loadedMonth

        return (
            day
                ? <div className={style.calendar__container}>
                    {day.brown.isGarbageAdded && <div className={`${style.calendar__item} ${style.brown}`}></div>}
                    {day.black.isGarbageAdded && <div className={`${style.calendar__item} ${style.black}`}></div>}
                    {day.yellow.isGarbageAdded && <div className={`${style.calendar__item} ${style.yellow}`}></div>}
                    {day.blue.isGarbageAdded && <div className={`${style.calendar__item} ${style.blue}`}></div>}
                    {day.green.isGarbageAdded && <div className={`${style.calendar__item} ${style.green}`}></div>}
                </div>
                : null
        )
    }


    // save setting in object dayColorsInCalendar before send to DB (callendar settings)
    const dayColorHandler = (e, item) => {
        setDayColorsInCalendar(prevState => e.target.checked
            ? { ...prevState, [Object.keys(item)[0]]: { isGarbageAdded: true, isGarbageTaken: false } }
            : { ...prevState, [Object.keys(item)[0]]: { isGarbageAdded: false, isGarbageTaken: false } })
    }

    // call when click day in callendar
    const setDisplayedDayHandler = date => {
        sendDayColorsInCalendarToDB() // the same when click "Zapisz"
        setDisplayedDay(date)
        const day = loadedMonth[`${displayedMonth}-${date}`] // get current day from loadedMonth
        day ? setDayColorsInCalendar(day) : resetDayColorsInCalendar()
    }


    // update one day in manual in DB (today settings)
    const sendTODOAYColorsToDB = (e, item) => {

        const todayColorsList = e
            ? { ...todayColors, [Object.keys(item)[0]]: { isColorOpen: true, isNoBucketError: false, isRequestChangeColorWaiting: true } }
            : { ...todayColors, [Object.keys(item)[0]]: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true } }

        firestore.collection(MANUAL).doc(docNameToday).set({ [serialNumber]: todayColorsList }, { merge: true })
            .then(() => console.log('success set documents'))
            .catch(err => console.log('err', err))
    }

    const resetDayColorsInCalendar = () => setDayColorsInCalendar({
        brown: { isGarbageAdded: false, isGarbageTaken: false },
        black: { isGarbageAdded: false, isGarbageTaken: false },
        yellow: { isGarbageAdded: false, isGarbageTaken: false },
        blue: { isGarbageAdded: false, isGarbageTaken: false },
        green: { isGarbageAdded: false, isGarbageTaken: false },
    })

    return (
        <main className={style.background}>

            {/* alert  */}
            {showAlertSmall && <AlertSmall description="Dodano rezerwację." hide={() => setShowAlertSmall(false)} />}


            {isLoginHandler


                // user is log in
                ? serialNumber


                    // user is log in and HAVE Serial Number
                    ? <div>

                        {/* today container */}
                        <div className={style.today}>
                            <div className={style.today_container}>

                                <div>
                                    <p className={style.today_desc}>Planowany odbiór odpadów w dniu dzisiejszym ({docNameToday})</p>
                                    <div className={style.today_actualStateContainer}>
                                        {loadededTodayFromCalendar?.brown?.isGarbageAdded &&
                                            <div className={style.today_actualStateItemContainer}>
                                                <span className={`${style.today_actualState} ${style.brown}`}></span>
                                                <span
                                                    style={{ color: loadededTodayFromCalendar?.brown?.isGarbageTaken ? "green" : "red" }}
                                                    className={style.today_actualStateText}>
                                                    {loadededTodayFromCalendar?.brown?.isGarbageTaken ? "odebrano" : "oczekuje"}
                                                </span>

                                            </div>
                                        }
                                        {loadededTodayFromCalendar?.black?.isGarbageAdded &&
                                            <div className={style.today_actualStateItemContainer}>
                                                <span className={`${style.today_actualState} ${style.black}`}></span>
                                                <span
                                                    style={{ color: loadededTodayFromCalendar?.black?.isGarbageTaken ? "green" : "red" }}
                                                    className={style.today_actualStateText}>
                                                    {loadededTodayFromCalendar?.black?.isGarbageTaken ? "odebrano" : "oczekuje"}
                                                </span>
                                            </div>
                                        }
                                        {loadededTodayFromCalendar?.yellow?.isGarbageAdded &&
                                            <div className={style.today_actualStateItemContainer}>
                                                <span className={`${style.today_actualState} ${style.yellow}`}></span>
                                                <span
                                                    style={{ color: loadededTodayFromCalendar?.yellow?.isGarbageTaken ? "green" : "red" }}
                                                    className={style.today_actualStateText}>
                                                    {loadededTodayFromCalendar?.yellow?.isGarbageTaken ? "odebrano" : "oczekuje"}
                                                </span>

                                            </div>
                                        }
                                        {loadededTodayFromCalendar?.blue?.isGarbageAdded &&
                                            <div className={style.today_actualStateItemContainer}>
                                                <span className={`${style.today_actualState} ${style.blue}`}></span>
                                                <span
                                                    style={{ color: loadededTodayFromCalendar?.blue?.isGarbageTaken ? "green" : "red" }}
                                                    className={style.today_actualStateText}>
                                                    {loadededTodayFromCalendar?.blue?.isGarbageTaken ? "odebrano" : "oczekuje"}
                                                </span>

                                            </div>
                                        }
                                        {loadededTodayFromCalendar?.green?.isGarbageAdded &&
                                            <div className={style.today_actualStateItemContainer}>
                                                <span className={`${style.today_actualState} ${style.green}`}></span>
                                                <span
                                                    style={{ color: loadededTodayFromCalendar?.green?.isGarbageTaken ? "green" : "red" }}
                                                    className={style.today_actualStateText}>
                                                    {loadededTodayFromCalendar?.green?.isGarbageTaken ? "odebrano" : "oczekuje"}
                                                </span>
                                            </div>
                                        }
                                        {(Object.keys(loadededTodayFromCalendar).every(i => loadededTodayFromCalendar[i].isGarbageAdded === false) && Object.keys(loadededTodayFromCalendar).length !== 0) && <span className={`${style.today_actualState}`}>Nie dodano</span>}
                                        {Object.keys(loadededTodayFromCalendar).length === 0 && <span className={`${style.today_actualState}`}>Brak danych</span>}
                                    </div>
                                </div>


                                {todayErrorBlocked &&
                                    <div className={style.today_error}>
                                        <p className={style.today_errorDesc}>Bariera zablokowana</p>
                                        <div className={style.today_errorSVG}>
                                            <Warning />
                                        </div>

                                    </div>
                                }

                                <div className={style.today__set}>
                                    <p className={style.today_desc}>Aktualny stan (opóźnienie max 30s):</p>
                                    <div className={style.today__setList}>
                                        {colorsArray.map(item => {
                                            return (
                                                <div className={style.today__setListItem} key={Object.keys(item)[0]}>

                                                    <div className={style.today__setListItemcontainerFirst}>

                                                        <div className={style.today__setListItemcontainer}>
                                                            <span style={{ background: `var(--${Object.keys(item)[0]})` }} className={style.today__setListItemLabelColor}></span>
                                                            <span className={style.today__setListItemLabelText}>{Object.values(item)[0]}</span>
                                                        </div>

                                                        {todayColors[Object.keys(item)[0]]?.isNoBucketError &&
                                                            <div className={style.today__setListItemcontainer}>
                                                                <div className={style.today__setListItemLabelTextSVG}>
                                                                    <Warning />
                                                                </div>
                                                                <p className={style.today__setListItemLabelText}>brak pojemnika</p>
                                                            </div>}
                                                    </div>

                                                    <div className={style.today__setListItemcontainer}>

                                                        {todayColors[Object.keys(item)[0]]?.isRequestChangeColorWaiting
                                                            ? <p className={style.today__setListItemLabelText}>oczekiwanie...</p>
                                                            : todayColors[Object.keys(item)[0]]?.isColorOpen
                                                                ? <p className={style.today__setListItemLabelText}>otwarte</p>
                                                                : <p className={style.today__setListItemLabelText}>zamknięte</p>
                                                        }
                                                        <div className={style.today__setListItemSwitch}>
                                                            <Switch
                                                                onChange={event => sendTODOAYColorsToDB(event, item)}
                                                                checked={todayColors[Object.keys(item)[0]]?.isColorOpen ?? false}
                                                                offColor="#FF0000"
                                                                checkedIcon={false}
                                                                uncheckedIcon={false}
                                                                disabled={todayColors[Object.keys(item)[0]]?.isRequestChangeColorWaiting ? true : false}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* calendar container */}
                        <div className={style.calendar}>
                            <div className={style.calendar_container}>
                                <p className={style.calendar_desc}>Terminy odbioru odpadów w kolejnych dniach:</p>

                                {/* choose date */}
                                <div className={style.calendar_date}>
                                    <div className={style.calendar_dateContainer}>
                                        {showSpinner && <Spinner />}
                                        {showAlertCalendarError && <Alert alertName={showAlertCalendarError.name} alertDetails={showAlertCalendarError.details} click={() => setShowAlertCalendarError(false)} />}
                                        <Calendar
                                            defaultView="month"
                                            maxDetail="month"
                                            minDetail="month"
                                            maxDate={new Date(`${new Date().getFullYear() + 1}, ${new Date().getMonth() + 1}, ${new Date().getDate()}`)}
                                            minDate={new Date(`${new Date().getFullYear()}, ${new Date().getMonth() + 1}, ${new Date().getDate()}`)} //TODO ${new Date().getDate() + 1
                                            onActiveStartDateChange={handlerActiveDateChange}
                                            onClickDay={(value, event) => setDisplayedDayHandler(value.getDate())}
                                            showFixedNumberOfWeeks={true}
                                            tileContent={handlerTileContent} // add colors to day
                                        />
                                    </div>
                                </div>

                                {/* menu day colors */}
                                {displayedDay &&
                                    <div className={style.menu}>
                                        <div className={style.menu_top}>
                                            <p className={style.menu_desc}>Ustawienia w dniu {`${displayedMonth}-${displayedDay}`}</p>
                                            <button className={style.menu_button} onClick={() => sendDayColorsInCalendarToDB()}>Zapisz</button>
                                        </div>
                                        <div className={style.menu_list}>
                                            {colorsArray.map(item => {
                                                return (
                                                    <div className={style.menu_listItem} key={Object.keys(item)[0]}>
                                                        <input
                                                            className={style.menu_listItemInput}
                                                            checked={dayColorsInCalendar[Object.keys(item)[0]].isGarbageAdded}
                                                            onChange={e => dayColorHandler(e, item)}
                                                            type="checkbox"
                                                            name={Object.keys(item)[0]}
                                                            value={Object.keys(item)[0]} />
                                                        <label className={style.menu_listItemLabel} htmlFor={Object.keys(item)[0]}>
                                                            <span style={{ background: `var(--${Object.keys(item)[0]})` }} className={style.menu_listItemLabelColor}></span>
                                                            <span className={style.menu_listItemLabelText}>{Object.values(item)[0]}</span>
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    //user is log in and NOT have Serial Number
                    : <SerialNumber />


                // user is log out
                : <LoginRegisterFirebaseUI />
            }
        </main>
    )
}

export default Home

