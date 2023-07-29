import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faSignOut, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import icon from '/logo.png'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useUserData } from '../context/hooks'
import { reqLogout } from '../utils/auth'
import { reqGetProductsAutoComplete, ProductList } from '../utils/product'
import SearchListPopup from './SearchListPopup'
import './Header.scss'
import useDebounce from '../utils/hooks/useDebouce'

function Header() {
    const [searchParam] = useSearchParams()
    const [query, setQuery] = useState(searchParam.get('name') || '')
    const [autoCompleData, setAutoCompleteData] = useState<ProductList>([])
    const searchQuery = useDebounce(query, 200)
    const dropListRef = useRef<HTMLDivElement>(null)
    const { user } = useUserData()
    const navigate = useNavigate()
    const location = useLocation()
    function handleLogout() {
        reqLogout()
            .then(() => {
                if (['/orders', '/profile'].includes(window.location.pathname)) window.location.pathname = '/'
                else window.location.reload()
            })
    }
    useEffect(() => {
        if (searchQuery.trim() === '') return setAutoCompleteData([])
        reqGetProductsAutoComplete(searchQuery)
            .then(data => {
                setAutoCompleteData(data)
            })
    }, [searchQuery])
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const element = e.target as HTMLElement
            if (element.className === 'search-input') return
            if (element.className !== 'search-container') setAutoCompleteData([])
        }
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])
    return (
        <div className='header'>
            <div id='loader'></div>
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
                        setAutoCompleteData([])
                        navigate(`/search?name=${query}`)
                    }}
                >
                    <input
                        className='search-input'
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
                <SearchListPopup data={autoCompleData} setData={setAutoCompleteData} />
                <div className='account'>
                    {user !== null ?
                        <div className='logon'
                            onClick={() => {
                                dropListRef.current?.classList.toggle('hide')
                            }}>
                            <div className='avatar'>
                                <img src={user.avatar} alt='' />
                            </div>
                            <div ref={dropListRef} className='account-drop-list hide'>
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
                            <Link to='/login' state={{ from: location }}>Login</Link>
                            <span>|</span>
                            <Link to='/register'>Register</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header