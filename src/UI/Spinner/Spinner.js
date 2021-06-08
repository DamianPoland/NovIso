import React from 'react'
import style from './Spinner.module.css'

/* 
komponent do pokazywania Spinnera
w props musi się znaleść:
- nic
*/

const Spinner = () => {
    return (
        <div className={style.container}>
            <div className={style.loader}>Loading...</div>
        </div>
    )
}

export default Spinner