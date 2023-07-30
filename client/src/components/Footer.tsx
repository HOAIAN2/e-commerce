import { useLanguage } from '../context/hooks'
import './Footer.scss'

function Footer() {
    const { appLanguage, setAppLanguage } = useLanguage()
    return (
        <div className='footer'>
            <div>
                <span>
                    {"Online shoping @" + new Date().getFullYear()}
                </span>
                <a>Terms</a>
                <a>Privacy</a>
                <a>Security</a>
                <a>Status</a>
                <a>Docs</a>
                <a>Contact</a>
                <a>About</a>
                <a>Terms</a>
            </div>
            <select value={appLanguage}
                onChange={(e) => {
                    setAppLanguage(e.currentTarget.value)
                    localStorage.setItem('lang', e.currentTarget.value)
                }}>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
            </select>
        </div>
    )
}

export default Footer