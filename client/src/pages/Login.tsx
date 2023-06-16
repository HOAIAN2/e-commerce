import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import './Login.scss'

function Login() {
    const [hidePass, setHidePass] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('Demo error')
    return (
        <div className='login-container'>
            <form>
                <div>
                    <span>Login</span>
                </div>
                <div>
                    <input type="text" placeholder='Username'
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                    />
                </div>
                <div>
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
                <div className='error'>{error}</div>
                <div>
                    <button>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login