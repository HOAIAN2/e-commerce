import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserData, useLanguage } from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import { reqPostAvatar, reqPostInfo } from '../utils/user'
import './Profile.scss'

interface Language {
    info: string
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    email: string
    phoneNumber: string
    address: string
    save: string
    male: string
    female: string
    pleaseType: string
}

function Profile() {
    const { user, dispatchUser } = useUserData()
    const { appLanguage } = useLanguage()
    const [language, setLanguage] = useState<Language>()
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
        const validSignatures = [
            // png
            "iVBORw0KGgo",
            // jpeg, jpg
            "/9j/"
        ]
        setAvatarError('')
        const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
        const limitSize = 1024 * 1024
        if (!e.currentTarget.files) return
        if (e.currentTarget.files[0]?.size > limitSize) return setAvatarError(`File must be smaller than ${limitSize / 1024} KB`)
        if (!acceptFormats.includes(e.currentTarget.files[0]?.type)) return setAvatarError('Only accept png, jpg, jpeg')
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
            const data = fileReader.result as string
            if (!validSignatures.some(value => data.split(',')[1].startsWith(value))) return setAvatarError('Only accept png, jpg, jpeg')
            setAvatar(data)
            setAvatarError('')
        })
        fileReader.readAsDataURL(e.currentTarget.files[0])
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
        document.title = 'Profile'
    }, [])
    useEffect(() => {
        const required = { username, firstName, lastName, birthDate, sex, address }
        for (const key in required) {
            if (required[key as keyof typeof required].trim() === '') {
                language && setInfoError(`${language.pleaseType} ${language[key as keyof typeof language]}`)
                saveBtnRef.current?.classList.add('disable')
                break
            }
            else {
                setInfoError('')
                saveBtnRef.current?.classList.remove('disable')
            }
        }
    }, [username, firstName, lastName, birthDate, sex, address, email, phoneNumber, language])
    useEffect(() => {
        import(`./languages/${appLanguage}Profile.json`)
            .then((data: Language) => {
                setLanguage(data)
                document.title = data.info
            })
    }, [appLanguage])
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
                        {avatar !== user.avatar && <button onClick={handleUpdateAvatar} >{language?.save}</button>}
                        {avatarError && <span>{avatarError}</span>}
                    </div>
                </div>
                <div className="right">
                    <span className='title'>{language?.info}</span>
                    <div className="info-container">
                        <div className='info-data'>
                            <span>{language?.username}: </span> <input
                                value={username}
                                onInput={e => {
                                    setUsername(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>{language?.firstName}: </span> <input
                                value={firstName}
                                onInput={e => {
                                    setFirstName(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>{language?.lastName}: </span>  <input
                                value={lastName}
                                onInput={e => {
                                    setLastName(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>{language?.birthDate}: </span>  <input
                                type='date'
                                value={birthDate}
                                onInput={e => {
                                    setBirthDate(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>{language?.sex}: </span>  <input
                                id='info-male'
                                name='sex'
                                type='radio'
                                checked={sex === 'male'}
                                value='male'
                                onChange={e => {
                                    setSex(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <label htmlFor='info-male'>{language?.male}</label>
                            <input
                                id='info-female'
                                name='sex'
                                type='radio'
                                checked={sex === 'female'}
                                value='female'
                                onChange={e => {
                                    setSex(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <label htmlFor='info-female'>{language?.female}</label>
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
                            <span>{language?.phoneNumber}: </span>  <input
                                value={phoneNumber}
                                onInput={e => {
                                    setPhoneNumber(e.currentTarget.value)
                                    setEdited(true)
                                }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>{language?.address}: </span> <input
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
                                onClick={handlePostUserInfo}>{language?.save}</button>}
                        {infoError && <span className='info-error'>{infoError}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile