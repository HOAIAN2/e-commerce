import { RefObject, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useUserData from '../context/hooks'
// import { baseIMG } from '../utils/api-config'
import './Profile.scss'

function Profile() {
    const { user } = useUserData()
    const [avatar, setAvatar] = useState(user?.avatar)
    const [error, setError] = useState('')
    const inputFileRef = useRef<HTMLElement>(null)
    const imageRef = useRef<HTMLElement>(null)
    const location = useLocation()
    async function handleChangeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        setError('')
        const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
        const limitSize = 500 * 1024
        if (!e.target.files) return
        if (e.target.files[0]?.size > limitSize) return setError('language.sizeLimit')
        if (!acceptFormats.includes(e.target.files[0]?.type)) return setError('language.formatNotAccept')
        const file = new FileReader()
        file.addEventListener("load", () => {
            setAvatar(file.result as string)
            setError('')
        })
        e.currentTarget.files && file.readAsDataURL(e.currentTarget.files[0])
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
                    {avatar !== user.avatar && <button >Save</button>}
                    {error && <span>{error}</span>}
                </div>
                <div className="right"></div>
            </div>
        </div>)
}

export default Profile