import { useState, useRef, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faSignOut, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import icon from '/logo.png'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useUserData from '../context/hooks'
import { reqLogout } from '../utils/auth'
// import { reqGetProductsAutoComplete, ProductList } from '../utils/product'
import './Header.scss'

function Header() {
    const [searchParam] = useSearchParams()
    const [query, setQuery] = useState(searchParam.get('name') || '')
    // const [data, setData] = useState<ProductList>([])
    const dropListRef = useRef<HTMLElement>(null)
    const { user } = useUserData()
    const navigate = useNavigate()
    function handleLogout() {
        reqLogout()
            .then(() => {
                if (['/orders', '/profile'].includes(window.location.pathname)) window.location.pathname = '/'
                else window.location.reload()
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
                <form className='search-bar'
                    onSubmit={(e) => {
                        e.preventDefault()
                        navigate(`/search?name=${query}`)
                    }}
                >
                    <input
                        type='text'
                        placeholder='search'
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                        }} />
                    {query !== '' ?
                        <div onClick={() => { navigate(`/search?name=${query}`) }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </div> : null}
                </form>
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
                                <Link to='/profile'>
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Info</span>
                                </Link>
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