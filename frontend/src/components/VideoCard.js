import React, { useRef, useEffect } from 'react';
import { formatDate, formatNumber } from './utils';


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
                    <p>{formatNumber(video.like_count)}</p>
                </div>
                <div class='video-comment-count'>
                    <i class="fa-solid fa-comment-dots"></i>
                    <p>{formatNumber(video.comment_count)}</p>
                </div>
            </div>
            <div class='video-info-container'>
                <div class='video-uploader-time-container'>
                    <h3>{video.uploader}</h3>
                    <i class="fa-solid fa-circle"></i>
                    <h4>{formatDate(video.created_at)}</h4>
                </div>
                <p>{video.title}</p>
            </div>
        </div>
    );
};

export default VideoCard;