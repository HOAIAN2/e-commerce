import { FormEvent, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { reqLogin } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import { useUserData } from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import { getLanguage } from '../utils/languages'
import './Login.scss'

interface Language {
    login: string
    username: string
    password: string
    passwordTooShort: string
    usernameTooShort: string
}

function Login() {
    const [hidePass, setHidePass] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
    const [language, setLanguage] = useState<Language>()
    const navigate = useNavigate()
    const location = useLocation()
    const prePage = location.state?.from
    const { dispatchUser } = useUserData()
    function handleLogin(e: FormEvent) {
        e.preventDefault()
        setError('')
        if (username.length < 8) return setError(language?.usernameTooShort || '')
        if (password.length < 8) return setError(language?.passwordTooShort || '')
        reqLogin(username, password)
            .then(() => {
                return reqGetUser()
            })
            .then((data) => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch((error: Error) => {
                setError(error.message)
            })
    }
    useEffect(() => {
        const language = getLanguage()
        import(`./languages/${language}Login.json`)
            .then((data: Language) => {
                setLanguage(data)
                document.title = data.login
            })
        reqGetUser()
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch(error => {
                setChecking(false)
                if (error.message !== 'no token') console.error(error.message)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (checking) return null
    return (
        <div className='login-container'>
            <form onSubmit={handleLogin}>
                <div>
                    <span>{language?.login}</span>
                </div>
                <div>
                    <input type="text" placeholder={language?.username}
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                        autoFocus
                    />
                </div>
                <div>
                    {hidePass === true ?
                        <input type="password" placeholder={language?.password}
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                        /> :
                        <input type="text" placeholder={language?.password}
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                        />
                    }
                    <div className='hide-button'
                        onClick={() => {
                            setHidePass(!hidePass)
                        }}
                    >
                        {hidePass === true ? <FontAwesomeIcon icon={faEyeSlash} /> :
                            <FontAwesomeIcon icon={faEye} />
                        }
                    </div>
                </div>
                <div className='error'>{error}</div>
                <div>
                    <button>{language?.login}</button>
                </div>
            </form>
        </div>
    )
}

export default Login