// src/components/react/sections/AudioPlayer.tsx
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Check, X, ZoomIn } from "lucide-react";
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

// ── Custom themed language dropdown ──────────────────────
interface DropdownOption {
    value: string;
    label: string;
}

const LanguageDropdown: React.FC<{
    value: string;
    options: DropdownOption[];
    onChange: (v: string) => void;
    disabled?: boolean;
    placeholder?: string;
}> = ({ value, options, onChange, disabled, placeholder }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const selected = options.find(o => o.value === value);
    const buttonLabel = selected?.label ?? placeholder ?? "";

    return (
        <div className={`lang-dd ${open ? "is-open" : ""}`} ref={containerRef}>
            <button
                type="button"
                className="lang-dd-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                onClick={() => !disabled && setOpen(o => !o)}
            >
                <span className="lang-dd-label">{buttonLabel}</span>
                <ChevronDown size={14} className="lang-dd-chevron" aria-hidden="true" />
            </button>
            {open && options.length > 0 && (
                <ul className="lang-dd-menu" role="listbox">
                    {options.map(opt => {
                        const active = opt.value === value;
                        return (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={active}
                                className={`lang-dd-option ${active ? "is-active" : ""}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <span>{opt.label}</span>
                                {active && <Check size={14} aria-hidden="true" />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

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
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [showMiniBar, setShowMiniBar] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const audioRef = useRef(null);
    const playPauseRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Show the sticky mini bar once the main play/pause button scrolls
    // out of view (less than 50% visible). Only relevant for the stacked
    // mobile/tablet layout — the desktop open-book hides the bar via CSS.
    useEffect(() => {
        const target = playPauseRef.current;
        if (!target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowMiniBar(entry.intersectionRatio < 0.5);
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // Lock body scroll & wire Escape key while the image modal is open
    useEffect(() => {
        if (!isImageModalOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsImageModalOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [isImageModalOpen]);

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
            english: `In the heart of Assam, along the river-laced island of Majuli, the Satras have stood for nearly six centuries as living centres of devotion, art, and learning. Founded by the Vaishnavite saint Srimanta Sankardeva and shaped further by his disciples, these monastic institutions emerged in the fifteenth and sixteenth centuries as quiet sanctuaries where faith and creativity grew together.

A Satra is, at once, a temple and a school. Each day unfolds in measured rhythm: prayers at dawn, recitation of scripture, the practice of Borgeet and Sattriya dance, the patient craft of mask-making, and hours given to manuscript painting. Through this rhythm, generations of devotees have carried forward an inheritance that belongs not only to Assam, but to the wider story of Indian classical culture.

The manuscripts and artefacts preserved within these Satras — and now within the Majuli Museum — are more than relics. They are witnesses to a tradition that has shaped the Assamese identity, and a record of how art, devotion, and community can endure across the turning of centuries.`,
            hindi: `असम के हृदय में, माजुली के नदी-घिरे द्वीप पर, सत्र लगभग छह शताब्दियों से भक्ति, कला और ज्ञान के जीवंत केंद्रों के रूप में स्थापित हैं। वैष्णव संत श्रीमंत शंकरदेव द्वारा स्थापित और उनके शिष्यों द्वारा संवर्धित, ये मठ पंद्रहवीं और सोलहवीं शताब्दी में ऐसे शांत आश्रयों के रूप में उभरे जहाँ श्रद्धा और सर्जनशीलता साथ-साथ विकसित हुईं।

सत्र एक ही समय में मंदिर भी है और विद्यालय भी। प्रत्येक दिन एक सधे हुए लय में बीतता है — भोर की प्रार्थना, शास्त्रों का पाठ, बोरगीत और सत्रीया नृत्य का अभ्यास, मुखौटा निर्माण की धैर्यपूर्ण कला, और पांडुलिपि चित्रकला को समर्पित घंटे। इसी लय में पीढ़ियों ने एक ऐसी विरासत को आगे बढ़ाया है जो केवल असम की ही नहीं, बल्कि भारतीय शास्त्रीय संस्कृति की व्यापक कथा की भी है।

इन सत्रों में — और अब माजुली संग्रहालय में — संरक्षित पांडुलिपियाँ और कलाकृतियाँ केवल अवशेष नहीं हैं। ये एक ऐसी परंपरा की साक्षी हैं जिसने असमिया पहचान को आकार दिया, और इस बात का प्रमाण हैं कि कला, भक्ति और समुदाय शताब्दियों के परिवर्तन के बीच भी कैसे जीवित रह सकते हैं।`,
            assamese: `অসমৰ মাজত, ব্ৰহ্মপুত্ৰৰ বুকুত গঢ় লোৱা মাজুলী দ্বীপত, সত্ৰসমূহ প্ৰায় ছশতিকা ধৰি ভক্তি, কলা আৰু জ্ঞানৰ জীৱন্ত কেন্দ্ৰ হিচাপে থিয় হৈ আছে। মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱে স্থাপন কৰা আৰু তেওঁৰ শিষ্যসকলে গঢ়ি তোলা এই বৈষ্ণৱ মঠবোৰ পঞ্চদশ আৰু ষোড়শ শতিকাত শ্ৰদ্ধা আৰু সৃষ্টিশীলতাই একেলগে বিকাশ লাভ কৰা শান্ত আশ্ৰয়ৰূপে গঢ় লৈ উঠিছিল।

এটা সত্ৰ একেসময়তে মন্দিৰো, বিদ্যালয়ো। প্ৰতিটো দিন এক সংযত ছন্দত আগবাঢ়ে — ৰাতিপুৱাৰ প্ৰাৰ্থনা, শাস্ত্ৰ পাঠ, বৰগীত আৰু সত্ৰীয়া নৃত্যৰ সাধনা, মুখা নিৰ্মাণৰ ধৈৰ্য্যশীল শিল্প, আৰু পুথি চিত্ৰাংকনত নিয়োজিত প্ৰহৰ। এই ছন্দৰে ডেকা-গাভৰুসকলে যুগে যুগে এনে এক উত্তৰাধিকাৰ আগবঢ়াই আনিছে যি কেৱল অসমৰে নহয়, ভাৰতীয় শাস্ত্ৰীয় সংস্কৃতিৰ বহল কাহিনীৰো অংগ।

এই সত্ৰসমূহত — আৰু এতিয়া মাজুলী সংগ্ৰহালয়ত — সংৰক্ষিত পুথি আৰু সামগ্ৰীবোৰ কেৱল অৱশেষ নহয়। এইবোৰ এনে এক পৰম্পৰাৰ সাক্ষী, যিয়ে অসমীয়া পৰিচয় গঢ় দিছে; আৰু কেনেকৈ কলা, ভক্তি আৰু সমাজে শতিকাৰ পৰিৱৰ্তনৰ মাজতো জীয়াই থাকিব পাৰে, তাৰ এক জ্বলন্ত প্ৰমাণ।`
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
            <section className="open-book">
                <article className="book-spread">
                    {/* Left Page — Player */}
                    <div className="left-page">
                        <div className="page-top-row">
                            <h1 className="book-title">Assamese Manuscript Archive - Samaguri Satra</h1>
                            <LanguageDropdown
                                value={language}
                                onChange={setLanguage}
                                disabled={!artifactData}
                                placeholder="No Audios Found!"
                                options={
                                    artifactData
                                        ? [
                                            ...(artifactData.english_audio_url ? [{ value: "english", label: "English" }] : []),
                                            ...(artifactData.hindi_audio_url ? [{ value: "hindi", label: "हिंदी (Hindi)" }] : []),
                                            ...(artifactData.assamese_audio_url ? [{ value: "assamese", label: "অসমীয়া (Assamese)" }] : []),
                                        ]
                                        : []
                                }
                            />
                        </div>

                        <div className="exhibit-info">
                            <button
                                type="button"
                                className="exhibit-thumbnail-button"
                                onClick={() => setIsImageModalOpen(true)}
                                aria-label="View image in larger size"
                            >
                                <img
                                    src={thumbnail}
                                    alt="Exhibit thumbnail"
                                    className="exhibit-thumbnail"
                                />
                                <span className="exhibit-thumbnail-zoom" aria-hidden="true">
                                    <ZoomIn size={18} />
                                </span>
                            </button>
                            <div className="exhibit-text">
                                <h3 className="exhibit-title">
                                    {artifactData?.name || "History of Satras"}
                                </h3>
                                <p className="exhibit-subtitle">
                                    {artifactData?.category || "Majuli Museum, Govt. of Assam"}
                                </p>
                            </div>
                        </div>

                        <div className="audio-controls">
                            <div className="control-buttons">
                                <button className="skip-button" onClick={skipBackward}>
                                    <FaStepBackward /> 10s
                                </button>
                                <button
                                    ref={playPauseRef}
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

                    {/* Right Page — Description */}
                    <div className="right-page">
                        <div className="page-top-row right-page-top">
                            <h2 className="chapter-title">
                                {artifactData?.name || "The Satras of Assam"}
                            </h2>
                        </div>
                        <div className="chapter-divider" aria-hidden="true">
                            <span className="chapter-divider-line" />
                            <span className="chapter-divider-star">✦</span>
                            <span className="chapter-divider-line" />
                        </div>
                        <div className="description-content">
                            {getDescription(language).split('\n\n').map((paragraph, index) => (
                                <p key={`${language}-${index}`} className="description-paragraph">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>

                <footer className="book-footer">
                    <ol id="page-numbers">
                        <li>1</li>
                        <li>2</li>
                    </ol>
                </footer>
            </section>

            <audio
                ref={audioRef}
                src={languageAudioMap[language]}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error:", e)}
            />

            {showMiniBar && languageAudioMap[language] && isMounted && createPortal(
                <div
                    className="mini-audio-bar"
                    style={{ '--mini-progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as React.CSSProperties}
                    role="region"
                    aria-label="Now playing"
                >
                    <img
                        src={thumbnail}
                        alt=""
                        className="mini-audio-bar-thumb"
                        aria-hidden="true"
                    />
                    <div className="mini-audio-bar-text">
                        <span className="mini-audio-bar-title">
                            {artifactData?.name || "History of Satras"}
                        </span>
                        <span className="mini-audio-bar-time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>
                    <div className="mini-audio-bar-controls">
                        <button
                            type="button"
                            className="mini-audio-bar-skip"
                            onClick={skipBackward}
                            aria-label="Skip back 10 seconds"
                        >
                            <SkipBack size={18} />
                        </button>
                        <button
                            type="button"
                            className="mini-audio-bar-playpause"
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button
                            type="button"
                            className="mini-audio-bar-skip"
                            onClick={skipForward}
                            aria-label="Skip forward 10 seconds"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {isImageModalOpen && (
                <div
                    className="image-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Artifact image viewer"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <button
                        type="button"
                        className="image-modal-close"
                        onClick={() => setIsImageModalOpen(false)}
                        aria-label="Close image viewer"
                    >
                        <X size={20} />
                    </button>
                    <figure
                        className="image-modal-figure"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={thumbnail}
                            alt={artifactData?.name || "Artifact"}
                            className="image-modal-image"
                        />
                        {(artifactData?.name || artifactData?.category) && (
                            <figcaption className="image-modal-caption">
                                {artifactData?.name && (
                                    <span className="image-modal-caption-title">
                                        {artifactData.name}
                                    </span>
                                )}
                                {artifactData?.category && (
                                    <span className="image-modal-caption-subtitle">
                                        {artifactData.category}
                                    </span>
                                )}
                            </figcaption>
                        )}
                    </figure>
                </div>
            )}
        </div>
    );
};

// Wrapper component that handles data fetching from URL query params
// This bridges the Assamese Manuscript Archive routing (?id=) with the Artifex component interface
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
