// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './Loading.scss'
function Loading() {
    return (
        <div className="loading">
            <div className="container">
                <div style={{ "--index": 1 }}></div>
                <div style={{ "--index": 2 }}></div>
                <div style={{ "--index": 3 }}></div>
                <div style={{ "--index": 4 }}></div>
                <div style={{ "--index": 5 }}></div>
                <div style={{ "--index": 6 }}></div>
            </div>
        </div>
    )
}

export default Loading