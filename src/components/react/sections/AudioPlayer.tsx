// src/components/react/sections/AudioPlayer.tsx
import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import "./AudioPlayer.css";
import { getArtifactById } from "../../../backend/actions/artifact";
import thumbnailImage from "../../../assets/horai.png";
import englishAudioFile from "../../../assets/audioenglish.wav";
import hindiAudioFile from "../../../assets/audiohindi.wav";
import assameseAudioFile from "../../../assets/audioassamese.wav";

// Icon wrapper components to match react-icons/fa API
const FaPlay = ({ size }: { size?: number }) => <Play size={size || 14} />;
const FaPause = ({ size }: { size?: number }) => <Pause size={size || 14} />;
const FaStepBackward = () => <SkipBack size={14} />;
const FaStepForward = () => <SkipForward size={14} />;
const FaVolumeUp = () => <Volume2 size={20} />;
const FaVolumeMute = () => <VolumeX size={20} />;

interface AudioPlayerProps {
    artifactData?: any;
}

// Inner component that renders the actual player (same as Artifex)
const AudioPlayerInner: React.FC<AudioPlayerProps> = ({ artifactData = null }) => {

    // Use props if available, otherwise fallback to static data
    const staticThumbnail = thumbnailImage;
    const staticEnglishAudio = englishAudioFile;
    const staticHindiAudio = hindiAudioFile;
    const staticAssameseAudio = assameseAudioFile;

    // Use artifact data if available, otherwise use static data
    const thumbnail = artifactData?.imageUrl || staticThumbnail;
    // const englishAudio = artifactData?.english_audio_url || staticEnglishAudio;
    // const hindiAudio = artifactData?.hindi_audio_url || staticHindiAudio;
    // const assameseAudio = artifactData?.assamese_audio_url || staticAssameseAudio;
    const englishAudio = artifactData?.english_audio_url;
    const hindiAudio = artifactData?.hindi_audio_url;
    const assameseAudio = artifactData?.assamese_audio_url;


    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [language, setLanguage] = useState('english');
    const audioRef = useRef(null);

    // Map language to audio file
    const languageAudioMap = {
        english: englishAudio,
        hindi: hindiAudio,
        assamese: assameseAudio
    };

    // Map language to description with fallback
    const getDescription = (lang: string) => {
        // Use fetched description if available
        if (artifactData) {
            if (lang === 'english' && artifactData.english_description)
                return artifactData.english_description;
            if (lang === 'hindi' && artifactData.hindi_description)
                return artifactData.hindi_description;
            if (lang === 'assamese' && artifactData.assamese_description)
                return artifactData.assamese_description;
        }

        // Fallback to static descriptions
        return {
            english: `The Satras of Assam are monastic institutions established by the great Vaishnavite saint Srimanta Sankardeva and his disciples in the 15th-16th centuries. These unique centers of art, culture, and spirituality have preserved traditional dance, music, and craft forms for over five centuries.

Each Satra follows a strict daily routine of prayers, rituals, and artistic practices. The institution serves as both a spiritual center and a cultural academy, where young devotees learn traditional arts like Borgeet (classical music), Sattriya dance, and mask-making.

The Majuli Museum preserves artifacts and documents that showcase the rich history of these Satras, which played a crucial role in shaping Assamese culture and identity.`,
            hindi: `असम के सत्र महान वैष्णव संत श्रीमंत शंकरदेव और उनके शिष्यों द्वारा 15वीं-16वीं शताब्दी में स्थापित मठ संस्थान हैं। कला, संस्कृति और आध्यात्मिकता के ये अनूठे केंद्र पांच शताब्दियों से अधिक समय से पारंपरिक नृत्य, संगीत और शिल्प रूपों को संरक्षित कर रहे हैं।

प्रत्येक सत्र प्रार्थना, अनुष्ठान और कलात्मक प्रथाओं के सख्त दैनिक कार्यक्रम का पालन करता है। संस्था एक आध्यात्मिक केंद्र और एक सांस्कृतिक अकादमी दोनों के रूप में कार्य करती है, जहां युवा भक्त बोरगीत (शास्त्रीय संगीत), सत्रीया नृत्य और मुखौटा निर्माण जैसी पारंपरिक कलाएं सीखते हैं।

माजुली संग्रहालय कलाकृतियों और दस्तावेजों को संरक्षित करता है जो इन सत्रों के समृद्ध इतिहास को प्रदर्शित करता है, जिसने असमिया संस्कृति और पहचान को आकार देने में महत्वपूर्ण भूमिका निभाई है।`,
            assamese: `অসমৰ সত্ৰসমূহ মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱ আৰু তেওঁৰ শিষ্যসকলে ১৫-১৬ শতিকাত স্থাপন কৰা বৈষ্ণৱ মঠ। কলা-সংস্কৃতি আৰু আধ্যাত্মিকতাৰ এই অনন্য কেন্দ্ৰবোৰে পাঁচশতাধিক বছৰ ধৰি পৰম্পৰাগত নৃত্য, সংগীত আৰু শিল্পক ৰক্ষা কৰি আহিছে।

প্ৰতিটো সত্ৰত প্ৰাৰ্থনা, আচাৰ-অনুষ্ঠান আৰু কলা-চৰ্চাৰ কঠোৰ দৈনন্দিন কাৰ্যসূচী পালন কৰা হয়। এই অনুষ্ঠানবোৰে এক আধ্যাত্মিক কেন্দ্ৰ আৰু সাংস্কৃতিক বিদ্যালয়ৰ দৰে কাম কৰে, য'ত ডেকা-গাভৰুৱে বৰগীত, সত্ৰীয়া নৃত্য, মুখা তৈয়াৰী আদি পৰম্পৰাগত কলা শিকে।

মাজুলী সংগ্ৰহালয়ে সত্ৰৰ সমৃদ্ধ ইতিহাসৰ সাক্ষ্য দিয়া বিভিন্ন সামগ্ৰী আৰু দলিল সংৰক্ষণ কৰিছে, যিয়ে অসমীয়া সংস্কৃতি আৰু পৰিচয় গঢ়াত গুৰুত্বপূৰ্ণ ভূমিকা পালন কৰিছে।`
        }[lang];
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            audio.volume = volume;
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
        };

        if (audio) {
            audio.addEventListener("loadedmetadata", handleLoadedMetadata);
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("error", handleError);
        }

        return () => {
            if (audio) {
                audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
                audio.removeEventListener("timeupdate", handleTimeUpdate);
                audio.removeEventListener("error", handleError);
            }
        };
    }, [volume]);

    // Effect to change audio source when language changes
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            const currentPlaybackTime = audioRef.current.currentTime;

            audioRef.current.pause();
            audioRef.current.src = languageAudioMap[language];
            audioRef.current.load();

            // After metadata is loaded, set the time and resume if needed
            const handleCanPlay = () => {
                audioRef.current.currentTime = currentPlaybackTime;
                if (wasPlaying) {
                    audioRef.current.play().catch(e => console.error("Play failed:", e));
                }
                audioRef.current.removeEventListener('canplay', handleCanPlay);
            };

            audioRef.current.addEventListener('canplay', handleCanPlay);
            setIsPlaying(wasPlaying);
        }
    }, [language]);

    useEffect(() => {
        // If current language isn't available in the new artifactData, switch to first available language
        if (artifactData) {
            const availableLanguages = [];
            if (artifactData.english_audio_url) availableLanguages.push('english');
            if (artifactData.hindi_audio_url) availableLanguages.push('hindi');
            if (artifactData.assamese_audio_url) availableLanguages.push('assamese');

            if (!availableLanguages.includes(language) && availableLanguages.length > 0) {
                setLanguage(availableLanguages[0]);
            }
        }
    }, [artifactData]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (event) => {
        const newTime = parseFloat(event.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        audioRef.current.volume = volume > 0 ? 0 : 0.7;
        setVolume(volume > 0 ? 0 : 0.7);
    };

    const skipForward = () => {
        audioRef.current.currentTime += 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    const skipBackward = () => {
        audioRef.current.currentTime -= 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    return (
        <div className="audio-player-container">
            {/* Audio Player (now on the left) */}
            <div className="audio-player">
                {/* Language Selector */}
                <div className="language-selector">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-dropdown"
                    >
                        {/* When artifactData is provided, only show available languages */}
                        {artifactData ? (
                            <>
                                {artifactData.english_audio_url && <option value="english">English</option>}
                                {artifactData.hindi_audio_url && <option value="hindi">हिंदी (Hindi)</option>}
                                {artifactData.assamese_audio_url && <option value="assamese">অসমীয়া (Assamese)</option>}
                            </>
                        ) : (
                            /* When no artifactData */
                            <>
                                <option>No Audios Found!</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Exhibit Info at Top */}
                <div className="exhibit-info">
                    <img
                        src={thumbnail}
                        alt="Exhibit thumbnail"
                        className="exhibit-thumbnail"
                    />
                    <div className="exhibit-text">
                        {/* Updated to show artifact name */}
                        <h3 className="exhibit-title">
                            {artifactData?.name || "History of Satras"}
                        </h3>
                        {/* Updated to show collection category */}
                        <p className="exhibit-subtitle">
                            {artifactData?.category || "Majuli Museum, Govt. of Assam"}
                        </p>
                    </div>
                </div>

                {/* Audio Controls */}
                <div className="audio-controls">
                    <div className="control-buttons">
                        <button className="skip-button" onClick={skipBackward}>
                            <FaStepBackward /> 10s
                        </button>
                        <button
                            className="play-pause-button"
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
                        </button>
                        <button className="skip-button" onClick={skipForward}>
                            10s <FaStepForward />
                        </button>
                    </div>

                    <div className="progress-container">
                        <div className="time-display-container">
                            <span className="time-display">{formatTime(currentTime)}</span>
                            <span className="time-display">{formatTime(duration)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-slider"
                            style={{ '--progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as React.CSSProperties}
                        />
                    </div>

                    <div className="volume-controls">
                        <button
                            className="volume-button"
                            onClick={toggleMute}
                            aria-label={volume > 0 ? "Mute" : "Unmute"}
                        >
                            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                            style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
                        />
                    </div>
                </div>
            </div>

            {/* Text Description (now on the right) */}
            <div className="text-description">
                <h2 className="description-title">
                    {artifactData?.name || "The Satras of Assam"}
                </h2>
                <div className="description-content">
                    {getDescription(language).split('\n\n').map((paragraph, index) => (
                        <p key={index} className="description-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <audio
                ref={audioRef}
                src={languageAudioMap[language]}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error:", e)}
            />
        </div>
    );
};

// Wrapper component that handles data fetching from URL query params
// This bridges the Samaguri routing (?id=) with the Artifex component interface
const AudioPlayer: React.FC = () => {
    const [artifactData, setArtifactData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) {
            setFetchError("No artifact ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getArtifactById(id);
                if (result.success && result.artifact) {
                    setArtifactData(result.artifact);
                } else {
                    setFetchError("Artifact not found.");
                }
            } catch {
                setFetchError("Failed to load artifact.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="audio-player-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: 48, height: 48,
                    border: '3px solid var(--color-hairline)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (fetchError || !artifactData) {
        return (
            <div className="audio-player-container" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: 'var(--color-ink)', fontSize: '1.1rem' }}>{fetchError || "No artifact data available."}</p>
                <a href="/collections" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>← Back to Collections</a>
            </div>
        );
    }

    return <AudioPlayerInner artifactData={artifactData} />;
};

export default AudioPlayer;