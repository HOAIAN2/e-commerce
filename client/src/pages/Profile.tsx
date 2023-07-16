import { RefObject, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useUserData from '../context/hooks'
import { USER_ACTION } from '../context/UserContext'
import { reqPostAvatar } from '../utils/user'
import './Profile.scss'

function Profile() {
    const { user, dispatchUser } = useUserData()
    const [avatar, setAvatar] = useState(user?.avatar)
    const [error, setError] = useState('')
    /// State for edit info
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
    const location = useLocation()
    async function handleChangeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        setError('')
        const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
        const limitSize = 500 * 1024
        if (!e.target.files) return
        if (e.target.files[0]?.size > limitSize) return setError(`File must be smaller than ${limitSize / 1024} KB`)
        if (!acceptFormats.includes(e.target.files[0]?.type)) return setError('Only accept png, jpg, jpeg')
        const file = new FileReader()
        file.addEventListener("load", () => {
            setAvatar(file.result as string)
            setError('')
        })
        e.currentTarget.files && file.readAsDataURL(e.currentTarget.files[0])
    }
    function handleUpdateAvatar() {
        if (!inputFileRef.current?.files) return
        reqPostAvatar(inputFileRef.current?.files[0])
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
            })
    }
    if (!user) return <Navigate to='/login' replace state={{ from: location }} />
    return (
        <div className="profile-page">
            <div className="container">
                <div className="left">
                    <div className="avatar">
                        <img src={avatar} alt=""
                            ref={imageRef as RefObject<HTMLImageElement>}
                            onClick={() => { inputFileRef.current?.click() }} />
                        <input ref={inputFileRef as RefObject<HTMLInputElement>}
                            onChange={handleChangeAvatar}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            id="file"
                            className="inputfile" />
                    </div>
                    {avatar !== user.avatar && <button onClick={handleUpdateAvatar} >Save</button>}
                    {error && <span>{error}</span>}
                </div>
                <div className="right">
                    <span className='title'>Basic Info</span>
                    <div className="info-container">
                        <div className='info-data'>
                            <span>First name: </span> <input
                                value={firstName}
                                onInput={e => { setFirstName(e.currentTarget.value) }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Last name: </span>  <input
                                value={lastName}
                                onInput={e => { setLastName(e.currentTarget.value) }}
                            /> <br />
                        </div>
                        {/* <div className='info-data'>
                            <span>Birth date: </span> <span>{user.birthDate.toLocaleDateString('vi-vn')}</span> <br />
                        </div> */}
                        <div className='info-data'>
                            <span>Birth date: </span>  <input
                                type='date'
                                value={birthDate}
                                onInput={e => { setBirthDate(e.currentTarget.value) }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Sex: </span>  <input
                                value={sex}
                                onInput={e => { setSex(e.currentTarget.value) }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Email: </span>  <input
                                value={email}
                                onInput={e => { setEmail(e.currentTarget.value) }}
                            /> <br />
                        </div>
                        <div className='info-data'>
                            <span>Phone number: </span>  <input
                                value={phoneNumber}
                                onInput={e => { setPhoneNumber(e.currentTarget.value) }}
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
                        {edited && <button>Save</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile