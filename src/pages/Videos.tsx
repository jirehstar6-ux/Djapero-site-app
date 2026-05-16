import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
import { useTheme } from "../context/ThemeContext";
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MessageCircle, X } from "lucide-react";

export default function Videos() {
    const { data } = useData();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const videos = data?.videos || [];

    const [activeVideo, setActiveVideo] = useState<any>(null);

    return (
        <div className={`min-h-[100dvh] pt-24 pb-12 px-4 md:px-8 font-sans ${isLight ? 'bg-slate-50' : 'bg-[#020617]'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className={`text-4xl font-black uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Vidéos
                    </h1>
                    <div className={`w-20 h-2 mt-4 rounded-full ${isLight ? 'bg-[#6aa84f]' : 'bg-[#a3e635]'}`}></div>
                </div>

                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-bold uppercase tracking-widest text-sm">
                        Aucune vidéo pour le moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                            <div key={video.id} className="relative rounded-3xl overflow-hidden shadow-xl group bg-slate-900 border border-slate-800/50 hover:shadow-2xl transition-all duration-300">
                                <VideoCard video={video} onClick={() => setActiveVideo(video)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {activeVideo && (
                    <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function VideoModal({ video, onClose }: { video: any, onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [likes, setLikes] = useState(12000 + Math.floor(Math.random() * 500));
    const [isLiked, setIsLiked] = useState(false);

    const getYoutubeId = (url: string) => {
        if (!url) return '';
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url;
        let videoId = '';
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId || url;
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: video.title,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Lien copié dans le presse-papiers!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const formatLikes = (num: number) => {
        return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
    };

    const isFile = video.srcType === 'file' || (!video.srcType && (video.src?.includes('/api/upload') || video.src?.match(/\.(mp4|webm|ogg|mov)$/i) || video.src?.includes('/uploads')));
    const isYoutube = video.srcType === 'youtube' || (!video.srcType && !isFile && !video.src?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    const youtubeId = isYoutube ? getYoutubeId(video.src) : '';

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-6"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <X size={24} />
            </button>

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative flex-shrink-0 md:flex-shrink"
                onClick={e => e.stopPropagation()}
            >
                {isYoutube ? (
                    <iframe 
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video 
                        ref={videoRef}
                        src={video.src || undefined}
                        className="w-full h-full"
                        controls
                        autoPlay
                        poster={video.thumbnail || undefined}
                    />
                )}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-5xl md:w-80 flex-shrink-0 text-white flex flex-col"
            >
                <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight break-words">{video.title}</h2>
                {video.caption && <p className="text-white/70 text-sm mb-6 whitespace-pre-wrap">{video.caption}</p>}

                <div className="flex gap-4">
                    <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl font-bold transition-colors">
                        <Share2 size={18} /> Partager
                    </button>
                    <button onClick={() => { setIsLiked(!isLiked); setLikes(l => isLiked ? l - 1 : l + 1); }} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> {formatLikes(likes)}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function VideoCard({ video, onClick }: { video: any, onClick: () => void }) {
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
                });
            },
            { threshold: 0.7 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        if (iframeRef.current) observer.observe(iframeRef.current);

        return () => observer.disconnect();
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
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

    const getYoutubeId = (url: string) => {
        if (!url) return '';
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url; // Might be just the ID already
        let videoId = '';
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId || url;
    };

    const isFile = video.srcType === 'file' || (!video.srcType && (video.src?.includes('/api/upload') || video.src?.match(/\.(mp4|webm|ogg|mov)$/i) || video.src?.includes('/uploads')));
    const isYoutube = video.srcType === 'youtube' || (!video.srcType && !isFile && !video.src?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    const youtubeId = isYoutube ? getYoutubeId(video.src) : '';

    return (
        <div className="relative w-full aspect-video overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer group" onClick={onClick}>
            {/* Video Background */}
            <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                {isYoutube ? (
                    <div className="relative w-full h-full pointer-events-none">
                        <iframe 
                            ref={iframeRef}
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1`}
                            className="w-full h-full object-cover scale-[1.05] origin-center"
                            allow="autoplay; encrypted-media"
                        />
                    </div>
                ) : (
                    <video 
                        ref={videoRef}
                        src={video.src || undefined}
                        className="w-full h-full object-cover"
                        controls={false}
                        loop
                        playsInline
                        muted={isMuted}
                        onTimeUpdate={handleTimeUpdate}
                        poster={video.thumbnail || undefined}
                    />
                )}
            </div>

            {/* Top Right: 12k overlay */}
            <div className="absolute top-0 right-6 md:right-8 w-10 md:w-12 h-16 md:h-20 bg-gradient-to-b from-white/30 to-transparent rounded-b-2xl flex items-end justify-center pb-3 md:pb-4 z-30 shadow-2xl backdrop-blur-sm border border-white/20 border-t-0">
                <span className="text-white font-[1000] text-[9px] md:text-[10px] shadow-black drop-shadow-md">12k</span>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 p-6 md:p-8 flex justify-between z-20 items-stretch">
                
                {/* Left Side: Play & Title */}
                <div className="flex flex-col justify-center items-start w-3/4">
                    <Play className="text-white w-12 h-12 md:w-14 md:h-14 mb-2 transform transition-transform group-hover:scale-110 drop-shadow-2xl" fill="currentColor" strokeWidth={0} />
                    <h3 className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-lg line-clamp-2 w-full break-all">
                        {video.title}
                    </h3>
                </div>

                {/* Right Side: Share */}
                <div className="flex flex-col justify-end items-end h-full">
                    {/* Bottom Right: Share */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                                navigator.share({ title: video.title, url: window.location.href });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Lien copié!");
                            }
                        }}
                        className="flex flex-col items-center group/share hover:scale-110 transition-transform"
                    >
                        <Share2 className="text-white w-6 h-6 md:w-7 md:h-7 mb-1.5 drop-shadow-xl" strokeWidth={2} />
                        <span className="text-white text-[8px] md:text-[9px] font-[1000] uppercase tracking-widest drop-shadow-xl">Partager</span>
                    </button>
                </div>

            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20">
                {video.srcType === 'file' ? (
                    <div 
                        className="h-full bg-white rounded-r-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                ) : null}
            </div>
        </div>
    );
}
