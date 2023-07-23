import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserData } from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import { reqPostAvatar, reqPostInfo } from '../utils/user'
import './Profile.scss'

function Profile() {
    const { user, dispatchUser } = useUserData()
    const [avatar, setAvatar] = useState(user?.avatar)
    const [avatarError, setAvatarError] = useState('')
    const [infoError, setInfoError] = useState('')
    /// State for edit info
    const [username, setUsername] = useState(user?.username || '')
    const [firstName, setFirstName] = useState(user?.firstName || '')
    const [lastName, setLastName] = useState(user?.lastName || '')
    const [birthDate, setBirthDate] = useState(() => {
        const year = user?.birthDate.toLocaleString('default', { year: 'numeric' })
        const month = user?.birthDate.toLocaleString('default', { month: '2-digit' })
        const day = user?.birthDate.toLocaleString('default', { day: '2-digit' })
        return [year, month, day].join('-')
    })
    const [sex, setSex] = useState(user?.sex || 'male')
    const [address, setAddress] = useState(user?.address || '')
    const [email, setEmail] = useState(user?.email || '')
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
    const [edited, setEdited] = useState(false)
    ///
    const inputFileRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const saveBtnRef = useRef<HTMLButtonElement>(null)
    const location = useLocation()
    async function handleChangeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        setAvatarError('')
        const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
        const limitSize = 1024 * 1024
        if (!e.target.files) return
        if (e.target.files[0]?.size > limitSize) return setAvatarError(`File must be smaller than ${limitSize / 1024} KB`)
        if (!acceptFormats.includes(e.target.files[0]?.type)) return setAvatarError('Only accept png, jpg, jpeg')
        const file = new FileReader()
        file.addEventListener("load", () => {
            setAvatar(file.result as string)
            setAvatarError('')
        })
        e.currentTarget.files && file.readAsDataURL(e.currentTarget.files[0])
    }
    function handleUpdateAvatar(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.currentTarget.classList.add('disable')
        if (!inputFileRef.current?.files) return
        reqPostAvatar(inputFileRef.current?.files[0])
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
            })
    }
    function handlePostUserInfo() {
        // if(username,firstName,lastName,sex)
        reqPostInfo({
            username,
            firstName,
            lastName,
            birthDate,
            sex: sex === 'male' ? 'm' : 'f',
            address,
            email,
            phoneNumber
        }).then(data => {
            dispatchUser({ type: USER_ACTION.SET, payload: data })
        })
    }
    useEffect(() => {
        setAvatar(user?.avatar)
    }, [user?.avatar])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    useEffect(() => {
        const required = { username, firstName, lastName, birthDate, sex, address }
        for (const key in required) {
            if (required[key as keyof typeof required].trim() === '') {
                setInfoError(`Please type ${key}`)
                saveBtnRef.current?.classList.add('disable')
                break
            }
            else {
                setInfoError('')
                saveBtnRef.current?.classList.remove('disable')
            }
        }
    }, [username, firstName, lastName, birthDate, sex, address, email, phoneNumber])
    if (!user) return <Navigate to='/login' replace state={{ from: location }} />
    return (
        <div className="profile-page">
            <div className="container">
                <div className="left">
                    <div className='data'>
                        <div id="avatar-loader">
                            <div className="avatar">
                                <img src={avatar} alt=""
                                    ref={imageRef}
                                    onClick={() => { inputFileRef.current?.click() }} />
                            </div>
                            <input ref={inputFileRef}
                                onChange={handleChangeAvatar}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                id="file"
                                className="inputfile" />
                        </div>
                        {avatar !== user.avatar && <button onClick={handleUpdateAvatar} >Save</button>}
                        {avatarError && <span>{avatarError}</span>}
                    </div>
                </div>
                <div className="right">
                    <span className='title'>Basic Info</span>
                    <div className="info-container">
                        <div className='info-data'>
                            <span>Username: </span> <input
                                value={username}
                                onInput={e => {
                                    setUsername(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>First name: </span> <input
                                value={firstName}
                                onInput={e => {
                                    setFirstName(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Last name: </span>  <input
                                value={lastName}
                                onInput={e => {
                                    setLastName(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        {/* <div className='info-data'>
                            <span>Birth date: </span> <span>{user.birthDate.toLocaleDateString('vi-vn')}</span> <br />
                        </div> */}
                        <div className='info-data'>
                            <span>Birth date: </span>  <input
                                type='date'
                                value={birthDate}
                                onInput={e => {
                                    setBirthDate(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Sex: </span>  <input
                                name='sex'
                                type='radio'
                                // value={sex}
                                checked={sex === 'male'}
                                value='male'
                                onChange={e => {
                                    setSex(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <label>male</label>
                            <input
                                name='sex'
                                type='radio'
                                checked={sex === 'female'}
                                value='female'
                                onChange={e => {
                                    setSex(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <label>female</label>
                            <br />
                        </div>
                        <div className='info-data'>
                            <span>Email: </span>  <input
                                value={email}
                                onInput={e => {
                                    setEmail(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Phone number: </span>  <input
                                value={phoneNumber}
                                onInput={e => {
                                    setPhoneNumber(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Address: </span> <input
                                value={address}
                                onInput={e => {
                                    setAddress(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        {edited &&
                            <button
                                ref={saveBtnRef}
                                onClick={handlePostUserInfo}>Save</button>}
                        {infoError && <span className='info-error'>{infoError}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile