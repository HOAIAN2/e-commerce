import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import icon from "/vite.svg"
import { Link } from 'react-router-dom'

import "./Header.scss"

function Header() {
    const [query, setQuery] = useState('')
    const user = null // demo, gonna change when call api
    return (
        <div className="header">
            <div className="left">
                <div className='title'>
                    <img src={icon} alt="" />
                    <span>Online shoping</span>
                </div>
                <div className="options">
                    <span>Categories</span>
                </div>
                <div className="options">
                    <span>Brands</span>
                </div>
            </div>
            <div className="right">
                <div className='search-bar'>
                    <input type="text" value={query} onChange={e => { setQuery(e.target.value) }} />
                    {query !== '' ? <div>
                        <FontAwesomeIcon icon={faSearch} />
                    </div> : null}
                </div>
                <div className="account">
                    {user !== null ?
                        <div>

                        </div>
                        : <div className="not-logon">
                            <Link to='/login'>Login</Link>
                            <span>|</span>
                            <Link to='/register'>Register</Link>
                        </div>
                    }
                </div>
                {/* <div className="cart">
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Cart</span>
                </div> */}
            </div>
        </div>
    )
}

export default Header