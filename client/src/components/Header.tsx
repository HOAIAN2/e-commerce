import { useState, useRef, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faSignOut, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import icon from '/logo.png'
import { Link } from 'react-router-dom'
import useUserData from '../context/hooks'
import { reqLogout } from '../utils/auth'
import './Header.scss'

function Header() {
    const [query, setQuery] = useState('')
    const dropListRef = useRef<HTMLElement>(null)
    const { user } = useUserData()
    function handleLogout() {
        reqLogout()
            .then(() => {
                window.location.reload()
            })
    }
    return (
        <div className='header'>
            <div className='left'>
                <Link className='title' to='/'>
                    <img src={icon} alt='' />
                    <span>Online shoping</span>
                </Link>
                <div className='options'>
                    <span>Categories</span>
                </div>
                <div className='options'>
                    <span>Brands</span>
                </div>
            </div>
            <div className='right'>
                <div className='search-bar'>
                    <input
                        type='text'
                        placeholder='search'
                        value={query}
                        onChange={e => { setQuery(e.target.value) }} />
                    {query !== '' ? <div>
                        <FontAwesomeIcon icon={faSearch} />
                    </div> : null}
                </div>
                <div className='account'>
                    {user !== null ?
                        <div className='logon'
                            onClick={() => {
                                dropListRef.current?.classList.toggle('hide')
                            }}>
                            <div className='avatar'>
                                <img src={user.avatar} alt='' />
                            </div>
                            <div ref={dropListRef as RefObject<HTMLDivElement>} className='account-drop-list hide'>
                                <div>
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Info</span>
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span>Order</span>
                                </div>
                                <div onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOut} />
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                        : <div className='not-logon'>
                            <Link to='/login'>Login</Link>
                            <span>|</span>
                            <Link to='/register'>Register</Link>
                        </div>
                    }
                </div>
                {/* <div className='cart'>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Cart</span>
                </div> */}
            </div>
        </div>
    )
}

export default Header