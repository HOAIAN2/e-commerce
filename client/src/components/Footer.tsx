import './Footer.scss'

function Footer() {
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
        </div>
    )
}

export default Footer