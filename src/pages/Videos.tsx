import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
import { useTheme } from "../context/ThemeContext";
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MessageCircle } from "lucide-react";

export default function Videos() {
    const { data } = useData();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const videos = data?.videos || [];

    return (
        <div className={`min-h-[100dvh] pt-24 pb-24 md:pb-12 flex justify-center items-center font-sans ${isLight ? 'bg-slate-100' : 'bg-[#020617]'}`}>
            <div className="w-full max-w-md h-[80vh] md:h-[85vh] bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl snap-y snap-mandatory overflow-y-scroll scroll-smooth border-4 md:border-8 border-black mb-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <style>{`
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {videos.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        Aucune vidéo pour le moment.
                    </div>
                ) : (
                    videos.map((video, index) => (
                        <div key={video.id} className="w-full h-full snap-start snap-always relative scroll-m-0">
                            <VideoPlayer video={video} index={index} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function VideoPlayer({ video, index }: { video: any, index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => {});
                        setIsPlaying(true);
                    } else {
                        videoRef.current?.pause();
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                        }
                        setIsPlaying(false);
                    }
                });
            },
            { threshold: 0.7 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        if (iframeRef.current) observer.observe(iframeRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: "command", func: isPlaying ? "playVideo" : "pauseVideo", args: [] }), "*");
        }
    }, [isPlaying]);

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: "command", func: isMuted ? "mute" : "unMute", args: [] }), "*");
        }
    }, [isMuted]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(p);
        }
    };

    const isFile = video.srcType === 'file' || (!video.srcType && video.src?.includes('/api/upload'));
    const isYoutube = video.srcType === 'youtube' || (!video.srcType && !video.src?.includes('/api/upload') && !video.src?.match(/\.(jpg|jpeg|png|gif|webp)$/i));

    return (
        <div className="absolute inset-0 bg-black">
            {isYoutube ? (
                <div className="absolute inset-0 pointer-events-auto" onClick={togglePlay}>
                    <iframe 
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${video.src}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.src}&playsinline=1&enablejsapi=1`}
                        className="w-full h-full object-cover pointer-events-none scale-150 transform-origin-center"
                        allow="autoplay; encrypted-media"
                    />
                </div>
            ) : (
                <video 
                    ref={videoRef}
                    src={video.src}
                    className="w-full h-full object-cover"
                    controls={false}
                    loop
                    playsInline
                    muted={isMuted}
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    poster={video.thumbnail || undefined}
                />
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none" />
            
            <button 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
            >
                {!isPlaying && <div className="bg-black/40 p-4 rounded-full backdrop-blur-md"><Play className="text-white w-12 h-12 ml-1" fill="currentColor" /></div>}
            </button>

            {/* Content Info */}
            <div className="absolute bottom-8 left-4 right-16 z-20 pointer-events-none">
                <h3 className="text-white font-[1000] text-lg uppercase tracking-tight leading-tight mb-2 drop-shadow-lg">{video.title}</h3>
                {video.caption && <p className="text-white/90 text-xs font-medium line-clamp-2 drop-shadow-md">{video.caption}</p>}
            </div>

            {/* Sidebar Actions */}
            <div className="absolute bottom-8 right-2 flex flex-col gap-5 items-center z-20">
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white/90 hover:text-white transition-all transform hover:scale-110 shadow-xl"
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <div className="flex flex-col items-center gap-1">
                    <button className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white/90 hover:text-[#a3e635] transition-all transform hover:scale-110 shadow-xl">
                        <Heart size={24} />
                    </button>
                    <span className="text-white text-[10px] font-bold drop-shadow-md whitespace-nowrap">12k</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white/90 hover:text-[#a3e635] transition-all transform hover:scale-110 shadow-xl">
                        <Share2 size={24} />
                    </button>
                    <span className="text-white text-[10px] font-bold drop-shadow-md whitespace-nowrap">Partager</span>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-white/20 z-20">
                {video.srcType === 'file' ? (
                    <div 
                        className="h-full bg-[#a3e635] rounded-r-full"
                        style={{ width: `${progress}%` }}
                    />
                ) : isPlaying ? (
                    <motion.div 
                        className="h-full bg-[#a3e635] rounded-r-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                    />
                ) : null}
            </div>
        </div>
    );
}
