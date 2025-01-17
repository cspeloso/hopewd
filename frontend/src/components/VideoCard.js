import React, { useRef, useEffect } from 'react';

const VideoCard = ({ video, isCurrent }) => {
    const videoRef = useRef();

    // Dynamically add "http://localhost:5001" to the video URL
    const videoUrl = `http://localhost:5001${video.url}`;

    useEffect(() => {
        if (isCurrent) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }
    }, [isCurrent]);

    return (
        <div className="video-card">
            <video
                ref={videoRef}
                src={videoUrl} // Use the modified video URL
                muted
                loop
                preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            >
                Your browser does not support the video tag.
            </video>
            <div className="video-likes-comments-container">
                <div class='video-like-count'>
                    <i class="fa-solid fa-heart"></i>
                    <p>{video.like_count}</p>
                </div>
                <div class='video-comment-count'>
                    <i class="fa-solid fa-comment-dots"></i>
                    <p>{video.comment_count}</p>
                </div>
            </div>
            <div class='video-info-container'>
                <h3>{video.uploader}</h3>
                <p>{video.title}</p>
            </div>
        </div>
    );
};

export default VideoCard;