import { baseIMG } from '../utils/api-config'
import './NotFound.scss'

function NotFound() {
    return (
        <div className="not-found">
            <img
                src={baseIMG + 'default/not_found.jpg'}
                alt="not-found"
            />
        </div>)
}

export default NotFound