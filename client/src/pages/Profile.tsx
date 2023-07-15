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
    const inputFileRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const location = useLocation()
    async function handleChangeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        setError('')
        const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
        const limitSize = 500 * 1024
        if (!e.target.files) return
        if (e.target.files[0]?.size > limitSize) return setError(`File must be smaller than ${limitSize / 1024} MB`)
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
                    <div className="info-container">
                        <div>
                            <span>Full name: </span> <span>{`${user.lastName} ${user.firstName}`}</span> <br />
                        </div>
                        <div>
                            <span>Birth date: </span> <span>{user.birthDate.toLocaleDateString('vi-vn')}</span> <br />
                        </div>
                        <div>
                            <span>Sex: </span> <span>{user.sex}</span> <br />
                        </div>
                        <div>
                            <span>Email: </span> <span>{user.email}</span> <br />
                        </div>
                        <div>
                            <span>Phone number: </span> <span>{user.phoneNumber}</span> <br />
                        </div>
                        <div>
                            <span>Address: </span> <span>{user.address}</span> <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Profile