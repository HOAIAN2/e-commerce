import { FormEvent, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { reqRegister } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import useUserData from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import './Register.scss'

function Register() {
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
    if (checking) return null
    return (
        <div className='register-container'>
            <form onSubmit={handleRegister}>
                <div>
                    <span>Register</span>
                </div>
                <div>
                    <label htmlFor="">Username:</label>
                    <input type="text" placeholder='Username'
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="">First name:</label>
                    <input type="text" placeholder='First name'
                        value={firstName}
                        onChange={e => { setFirstName(e.target.value) }}
                    />
                </div>
                <div>
                    <label htmlFor="">Last name:</label>
                    <input type="text" placeholder='Last name'
                        value={lastName}
                        onChange={e => { setLastName(e.target.value) }}
                    />
                </div>
                <div>
                    <label htmlFor="">Birth date:</label>
                    <input type="date" placeholder='Birth date'
                        value={birthDate}
                        onChange={e => { setBirthDate(e.target.value) }}
                    />
                </div>
                <div className='select-sex'>
                    <label htmlFor="">Sex:</label>
                    <div>
                        <input
                            name='sex'
                            type='radio'
                            // value={sex}
                            checked={sex === 'male'}
                            value='male'
                            onChange={e => {
                                setSex(e.currentTarget.value)
                            }}
                        /> <label>male</label>
                    </div>
                    <div>
                        <input
                            name='sex'
                            type='radio'
                            // value={sex}
                            checked={sex === 'female'}
                            value='female'
                            onChange={e => {
                                setSex(e.currentTarget.value)
                            }}
                        /> <label>female</label>
                    </div>
                </div>
                <div>
                    <label htmlFor="">Address:</label>
                    <input type="text" placeholder='Address'
                        value={address}
                        onChange={e => { setAddress(e.target.value) }}
                    />
                </div>
                <div>
                    <label htmlFor="">Email:</label>
                    <input type="text" placeholder='Email'
                        value={email}
                        onChange={e => { setEmail(e.target.value) }}
                    />
                </div>
                <div>
                    <label htmlFor="">Phone number:</label>
                    <input type="text" placeholder='Phone number'
                        value={phoneNumber}
                        onChange={e => { setPhoneNumber(e.target.value) }}
                    />
                </div>
                <div>
                    <label htmlFor="">Password:</label>
                    {hidePass === true ?
                        <input type="password" placeholder='Password'
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                        /> :
                        <input type="text" placeholder='Password'
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
                <div>
                    <label htmlFor="">Confirm password:</label>
                    {hidePass === true ?
                        <input type="password" placeholder='Password'
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value) }}
                        /> :
                        <input type="text" placeholder='Password'
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
                    <button>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Register