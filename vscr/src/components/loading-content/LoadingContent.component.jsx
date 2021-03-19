import React from 'react'
import "./loading-content.css"

function LoadingContent(props) {
    return (
        <div className="loading-content__component">
            <div className="loading-content__spinner"></div>
            <p>{props.message}</p>
        </div>
    )
}

export default LoadingContent
