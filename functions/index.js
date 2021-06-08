const functions = require("firebase-functions");
const cors = require('cors')({ origin: true })
const admin = require('firebase-admin')
admin.initializeApp() // inicjalizacja dostępu do baz



// to add admin, use this function on front. Remember to log out and log in
// const addAdminRole = functions.httpsCallable('addAdminRole')
// addAdminRole({ email: 'admin@noviso.pl', serialNumber: 'admin' })
//     .then(resp => console.log(resp))
//     .catch(err => console.log(err))

// add admin role => OK
exports.addAdminRole = functions.https.onCall(async (data, context) => {

    // check if user is admin
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not Login!') } // throw error - in front add .catch
    if (!context.auth.token.admin) { throw new functions.https.HttpsError('aborted', 'Not Admin!') } // throw error - in front add .catch

    try {
        // email added on front
        const user = await admin.auth().getUserByEmail(data.email)
        await admin.auth().setCustomUserClaims(user.uid, { admin: true, serialNumber: data.serialNumber })

        return `Success addAdminRole!` //response jest w return
    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})






// to add serialNumber, use this function on front. Remember to log out and log in
// const addSerialNumber = functions.httpsCallable('addSerialNumber')
// addSerialNumber({ serialNumber: '123456' })
//     .then(resp => console.log(resp))
//     .catch(err => console.log(err))

// add serial number => OK
exports.addSerialNumberToUser = functions.https.onCall(async (data, context) => {

    // check if user is log in
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not Login!') } // throw error - in front add .catch

    try {

        // get one serial number from doc with all serial numbers
        let serialNumbersDoc = await admin.firestore().collection('serial').doc('serial').get()
        serialNumbersDoc = serialNumbersDoc.data()
        const getserialNumberAddedByUser = serialNumbersDoc[data.serialNumber]

        //undefined => jeśli nie ma takiego numeru w bazie
        if (!getserialNumberAddedByUser) { throw new functions.https.HttpsError('internal', 'Taki numer nie istnieje.') }

        // occupied === true => jeśli ktoś już wykorzystuje ten numer
        if (getserialNumberAddedByUser.occupied) { throw new functions.https.HttpsError('already-exists', 'Ten numer jest już zajęty.') }

        // save in DB that this serial number is occupied by user
        await admin.firestore().collection('serial').doc('serial').set({ [data.serialNumber]: { occupied: true } }, { merge: true })

        // add custom claims with number to user
        await admin.auth().setCustomUserClaims(context.auth.uid, { admin: false, serialNumber: data.serialNumber })

        return `Success addSerialNumber ${data.serialNumber}`

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})



// typ funkcji: onRequest, type: POST Bariera zablokowana error dla danego użytkownika na podstawie numeru seryjnego => OK
// request.body = { userSerialNumber: false } lub request.body = { userSerialNumber: true } 
exports.novisoErrorBarieraZablokowana = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        if (request.method !== 'POST') {
            return response.status(400).send('bad request method') // dostęp w komponencie przez axios.catch(err => console.log(err.response.data))
        }

        admin.firestore().collection('error').doc('error').set(request.body, { merge: true }) // merge bariera zablokowana info for one serial number
        response.send({ succes: request.body })
    })
})



// typ funkcji: onRequest, type: GET, get all users seting for today => OK
exports.novisoGetManualForToday = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const todayDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` // get today date in format yyyy-m-dd

        const manualForToday = await admin.firestore().collection('manual').doc(todayDate).get()
        const manualForTodayData = manualForToday.data()

        response.send(manualForTodayData)
    })
})



// typ funkcji: onRequest, type: PUT, put all seting for one user for today  => OK
// request.body = {
//     userSerialNumber: {
//         brown: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
//         black: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
//         yellow: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
//         blue: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
//         green: { isColorOpen: false, isNoBucketError: false, isRequestChangeColorWaiting: true },
//     }}
exports.novisoPutManualForToday = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        if (request.method !== 'PUT') {
            return response.status(400).send('bad request method') // dostęp w komponencie przez axios.catch(err => console.log(err.response.data))
        }

        const todayDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` // get today date in format yyyy-m-dd

        admin.firestore().collection('manual').doc(todayDate).set(request.body, { merge: true }) // merge 

        response.send("success")
    })
})


// typ funkcji: onRequest, type: GET, get all serial number collections, return array of all serial numbers in DB => OK
exports.novisoGetAllCalendarCollections = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        // list of all collections
        const listOffAllCollections = await admin.firestore().listCollections()
        let listOffAllCollectionsArray = []

        listOffAllCollections.forEach(i => {

            // get collection name from item
            const collectionName = i["_queryOptions"].collectionId

            // usunięcie kolekcji które nie są numerami seryjnymi
            if (collectionName === "error") { return }
            if (collectionName === "manual") { return }
            if (collectionName === "serial") { return }

            listOffAllCollectionsArray.push(collectionName)
        })

        response.send(listOffAllCollectionsArray)
    })
})



// typ funkcji: onRequest, type: GET, get one user document with 2 month calendar data, serial number in query => OK
// request.query = { userSerialNumber: "serialNumber" }  nafrońcie dodać po endpoincie query np: https://us-central1-novisopl.cloudfunctions.net/novisoGetMonthCalendarUserData?userSerialNumber=serialNumber
exports.novisoGetMonthCalendarUserData = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        functions.logger.log('request.query: ', request.query)

        const yearMonthDateThisMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}` // get current month date in format yyyy-m
        const yearMonthDateNextMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 2}` // get next month date in format yyyy-m

        // get document current month from callendar
        let userCalendarDocumentThisMonth = await admin.firestore().collection(request.query.userSerialNumber).doc(yearMonthDateThisMonth).get() // request.query is ofter ? in endpoint
        userCalendarDocumentThisMonth = userCalendarDocumentThisMonth.data()

        // get document next month from callendar
        let userCalendarDocumentNextMonth = await admin.firestore().collection(request.query.userSerialNumber).doc(yearMonthDateNextMonth).get() // request.query is ofter ? in endpoint
        userCalendarDocumentNextMonth = userCalendarDocumentNextMonth.data()

        response.send({ ...userCalendarDocumentThisMonth, ...userCalendarDocumentNextMonth })
    })
})




// typ funkcji: onRequest, type: PUT, put today calendar user data => OK
// request.body = {
//     userSerialNumber: {
//         brown: { isGarbageAdded: true, isGarbageTaken: true },
//         black: { isGarbageAdded: true, isGarbageTaken: true },
//         yellow: { isGarbageAdded: true, isGarbageTaken: true },
//         blue: { isGarbageAdded: true, isGarbageTaken: true },
//         green: { isGarbageAdded: true, isGarbageTaken: true },
//     }}
exports.novisoPutTodayCalendarUserData = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        if (request.method !== 'PUT') {
            return response.status(400).send('bad request method') // dostęp w komponencie przez axios.catch(err => console.log(err.response.data))
        }

        const todayDateYearMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}` // get today date in format yyyy-m
        const todayDateYearMonthDay = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` // get today date in format yyyy-m-dd

        const userSerialNumber = Object.keys(request.body)[0]

        admin.firestore().collection(userSerialNumber).doc(todayDateYearMonth).set({ [todayDateYearMonthDay]: request.body[userSerialNumber] }, { merge: true })

        response.send("success")

    })
})