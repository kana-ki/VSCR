import React from 'react'
import "./loading-content.css"

function LoadingContent() {
    return (
        <div className="loading-content__component">
            <div className="loading-content__spinner"></div>
            <p>Connecting to websocket...</p>
        </div>
    )
}

export default LoadingContent
