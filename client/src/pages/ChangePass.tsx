import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { reqChangePass, reqLogout } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import { useUserData, useLanguage } from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import './ChangePass.scss'

interface Language {
    changePass: string
    password: string
    newPassword: string
    samePassword: string
    confirmPassword: string
    passwordTooShort: string
    confirmIncorrect: string
}

function ChangePass() {
    const [hidePass, setHidePass] = useState(true)
    const [hideNewPass, setHideNewPass] = useState(true)
    const [hideConfirmPass, setHideConfirmPass] = useState(true)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
    const [language, setLanguage] = useState<Language>()
    const navigate = useNavigate()
    const { dispatchUser } = useUserData()
    const { appLanguage } = useLanguage()
    function handleLogin(e: FormEvent) {
        e.preventDefault()
        setError('')
        if (password === newPassword) return setError(language?.samePassword || '')
        if (password.length < 8) return setError(language?.passwordTooShort || '')
        if (newPassword.length < 8) return setError(language?.passwordTooShort || '')
        if (newPassword !== confirmPassword) return setError(language?.confirmIncorrect || '')
        reqChangePass(password, newPassword)
            .then(() => {
                return reqLogout()
            })
            .then(() => {
                navigate('/login')
            })
            .catch((error: Error) => {
                setError(error.message)
            })
    }
    useEffect(() => {
        reqGetUser()
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                setChecking(false)
            })
            .catch(error => {
                setChecking(false)
                navigate('/login')
                if (error.message !== 'no token') console.error(error.message)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        import(`./languages/${appLanguage}ChangePass.json`)
            .then((data: Language) => {
                setLanguage(data)
                document.title = data.changePass
            })
    }, [appLanguage])
    if (checking) return null
    return (
        <div className='change-pass-container'>
            <form onSubmit={handleLogin}>
                <div>
                    <span>{language?.changePass}</span>
                </div>
                <div>
                    <input type={hidePass ? 'password' : 'text'} placeholder={language?.password}
                        value={password}
                        onChange={e => { setPassword(e.target.value) }}
                    />
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
                <div>
                    <input type={hideNewPass ? 'password' : 'text'} placeholder={language?.newPassword}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value) }}
                    />
                    <div className='hide-button'
                        onClick={() => {
                            setHideNewPass(!hideNewPass)
                        }}
                    >
                        {hideNewPass === true ? <FontAwesomeIcon icon={faEyeSlash} /> :
                            <FontAwesomeIcon icon={faEye} />
                        }
                    </div>
                </div>
                <div>
                    <input type={hideConfirmPass ? 'password' : 'text'} placeholder={language?.confirmPassword}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value) }}
                    />
                    <div className='hide-button'
                        onClick={() => {
                            setHideConfirmPass(!hideConfirmPass)
                        }}
                    >
                        {hideConfirmPass === true ? <FontAwesomeIcon icon={faEyeSlash} /> :
                            <FontAwesomeIcon icon={faEye} />
                        }
                    </div>
                </div>
                <div className='error'>{error}</div>
                <div>
                    <button>{language?.changePass}</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePass