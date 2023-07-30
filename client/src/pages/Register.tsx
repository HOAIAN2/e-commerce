import { FormEvent, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { reqRegister } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import { useUserData, useLanguage } from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import './Register.scss'

interface Language {
    register: string
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    email: string
    phoneNumber: string
    address: string
    password: string
    confirmPassword: string
    save: string
    male: string
    female: string
    pleaseType: string
}

function Register() {
    const { appLanguage } = useLanguage()
    const [language, setLanguage] = useState<Language>()
    const [hidePass, setHidePass] = useState(true)
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [sex, setSex] = useState('male')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const prePage = location.state?.from
    const { dispatchUser } = useUserData()
    function handleRegister(e: FormEvent) {
        e.preventDefault()
        setError('')
        if (username.length < 8) return setError('username must have at least 8 characters')
        if (password.length < 8) return setError('password must have at least 8 characters')
        if (password !== confirmPassword) return setError('Confirm password incorrect')
        reqRegister({
            username,
            password,
            firstName,
            lastName,
            birthDate,
            sex: sex === 'male' ? 'm' : 'f',
            address,
            email,
            phoneNumber
        })
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
    useEffect(() => {
        import(`./languages/${appLanguage}Register.json`)
            .then((data: Language) => {
                setLanguage(data)
                document.title = data.register
            })
    })
    if (checking) return null
    return (
        <div className='register-container'>
            <form onSubmit={handleRegister}>
                <div className='title'>
                    <span>{language?.register}</span>
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.username}:</label>
                    <div>
                        <input type="text" placeholder={language?.username}
                            required
                            value={username}
                            onChange={e => { setUsername(e.target.value) }}
                            autoFocus
                        />
                    </div>
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.firstName}:</label>
                    <input type="text" placeholder={language?.firstName}
                        required
                        value={firstName}
                        onChange={e => { setFirstName(e.target.value) }}
                    />
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.lastName}:</label>
                    <input type="text" placeholder={language?.lastName}
                        required
                        value={lastName}
                        onChange={e => { setLastName(e.target.value) }}
                    />
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.birthDate}:</label>
                    <input type="date"
                        required
                        value={birthDate}
                        onChange={e => { setBirthDate(e.target.value) }}
                    />
                </div>
                <div className='select-sex'>
                    <label className='require' htmlFor="">{language?.sex}:</label>
                    <div className='option'>
                        <input
                            id='register-male'
                            name='sex'
                            type='radio'
                            checked={sex === 'male'}
                            value='male'
                            onChange={e => {
                                setSex(e.currentTarget.value)
                            }}
                        /> <label htmlFor='register-male'>{language?.male}</label>
                    </div>
                    <div className='option'>
                        <input
                            id='register-female'
                            name='sex'
                            type='radio'
                            checked={sex === 'female'}
                            value='female'
                            onChange={e => {
                                setSex(e.currentTarget.value)
                            }}
                        /> <label htmlFor='register-female'>{language?.female}</label>
                    </div>
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.address}:</label>
                    <input type="text" placeholder={language?.address}
                        required
                        value={address}
                        onChange={e => { setAddress(e.target.value) }}
                    />
                </div>
                <div className='info-container'>
                    <label htmlFor="">{language?.email}:</label>
                    <input type="text" placeholder={language?.email}
                        value={email}
                        onChange={e => { setEmail(e.target.value) }}
                    />
                </div>
                <div className='info-container'>
                    <label htmlFor="">{language?.phoneNumber}:</label>
                    <input type="text" placeholder={language?.phoneNumber}
                        value={phoneNumber}
                        onChange={e => { setPhoneNumber(e.target.value) }}
                    />
                </div>
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.password}:</label>
                    {hidePass === true ?
                        <input type="password" placeholder={language?.password}
                            required
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                        /> :
                        <input type="text" placeholder={language?.password}
                            required
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
                <div className='info-container'>
                    <label className='require' htmlFor="">{language?.confirmPassword}:</label>
                    {hidePass === true ?
                        <input type="password" placeholder={language?.confirmPassword}
                            required
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value) }}
                        /> :
                        <input type="text" placeholder={language?.confirmPassword}
                            required
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value) }}
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
                <div className='confirm'>
                    <button>{language?.register}</button>
                </div>
            </form>
        </div>
    )
}

export default Register