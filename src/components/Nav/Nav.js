import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import style from './Nav.module.css'
import logo from '../../assets/logo512.png'

// constans
import { UID, ADMIN } from '../../shared/constans'

//firebase
import { auth } from '../../shared/fire'


const Nav = ({ isLogin, isAdmin }) => {

    // show hide log out button 
    const [isLoginFromStorage, setIsLoginFromStorage] = useState(false)
    useEffect(() => {
        setIsLoginFromStorage(localStorage.getItem(UID))
    }, [isLogin])

    // open & close mobile menu
    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
    let styleMobileMenu = isOpenMobileMenu ? style.listOpen : '' //menu list close/open
    let styleMobileButtonBurger = isOpenMobileMenu ? style.burgerOpen : '' //button burger close/open



    return (
        <header className={style.background}>
            <nav className={style.container}>
                <div className={style.header}>
                    <img className={style.headerImg} src={logo} alt='logo' />
                    <p className={style.headerDesc}>NOVISO - inteligentne sortowanie</p>
                </div>
                <ul onClick={() => setIsOpenMobileMenu(false)} className={`${style.list} ${styleMobileMenu}`}>
                    <li className={style.listItem}><NavLink to='/home' activeClassName={style.activeLink} className={style.listItemAnchor}>Strona główna</NavLink></li>

                    {/* admin button*/}
                    {isAdmin && <li className={style.listItem}><NavLink to='/admin' activeClassName={style.activeLink} className={style.listItemAnchor}>Admin</NavLink></li>}

                    {/* sign out button*/}
                    {isLoginFromStorage && <li className={style.listItem}><NavLink to='/home' onClick={() => auth.signOut()} className={style.listItemAnchor}>Wyloguj</NavLink></li>}


                </ul>
                <div onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)} className={`${style.burgerMenu} ${styleMobileButtonBurger}`}>
                    <div className={style.burgerBtn}></div>
                </div>

            </nav>
        </header>
    )
}

export default Nav