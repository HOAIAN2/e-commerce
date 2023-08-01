import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faSignOut, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import icon from '/logo.png'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useUserData, useLanguage } from '../context/hooks'
import { reqLogout } from '../utils/auth'
import { reqGetProductsAutoComplete, ProductList } from '../utils/product'
import SearchListPopup from './SearchListPopup'
import './Header.scss'
import useDebounce from '../utils/hooks/useDebouce'

interface Language {
    categories: string
    brands: string
    login: string
    register: string
    search: string
    info: string
    order: string
    logout: string
}

function Header() {
    const [searchParam] = useSearchParams()
    const [query, setQuery] = useState(searchParam.get('name') || '')
    const [autoCompleData, setAutoCompleteData] = useState<ProductList>([])
    const [language, setLanguage] = useState<Language>()
    const searchQuery = useDebounce(query, 200)
    const dropListRef = useRef<HTMLDivElement>(null)
    const { user } = useUserData()
    const { appLanguage } = useLanguage()
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
    useEffect(() => {
        import(`./languages/${appLanguage}Header.json`)
            .then((data: Language) => {
                setLanguage(data)
            })
    }, [appLanguage])
    return (
        <div className='header'>
            <div id='loader'></div>
            <div className='left'>
                <Link className='title' to='/'>
                    <img src={icon} alt='' />
                    <span>Online shoping</span>
                </Link>
                <div className='options'>
                    <span>{language?.categories}</span>
                </div>
                <div className='options'>
                    <span>{language?.brands}</span>
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
                        placeholder={language?.search}
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                        }} />
                    {query !== '' ?
                        <div onClick={() => { navigate(`/search?name=${query}`) }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </div> : null}
                </form>
                {document.activeElement?.className === 'search-input' ?
                    <SearchListPopup data={autoCompleData} setData={setAutoCompleteData} /> : null}
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
                                    <span>{language?.info}</span>
                                </Link>
                                <div>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span>{language?.order}</span>
                                </div>
                                <div onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOut} />
                                    <span>{language?.logout}</span>
                                </div>
                            </div>
                        </div>
                        : <div className='not-logon'>
                            <Link to='/login' state={{ from: location }}>{language?.login}</Link>
                            <span>|</span>
                            <Link to='/register'>{language?.register}</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header