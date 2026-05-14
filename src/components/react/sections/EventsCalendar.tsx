import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Search, Grid, List, X, CheckCircle, AlertCircle } from 'lucide-react';
import { WaypointsIcon } from '@/components/react/ui/ShareIcon';
import type { WaypointsIconHandle } from '@/components/react/ui/ShareIcon';
import { getAllEvents } from '@/backend/actions/events';

interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    category: 'exhibition' | 'workshop' | 'lecture' | 'cultural' | 'special';
    featured: boolean;
}

const EventsCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const waypointRef = useRef<WaypointsIconHandle>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleShare = async () => {
        try {
            const url = window.location.href;
            if (navigator.share) {
                await navigator.share({
                    title: selectedEvent?.title || 'Samaguri Satra Event',
                    text: selectedEvent?.description || 'Check out this event at Samaguri Satra',
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setToast({ message: 'Event link copied to clipboard!', type: 'success' });
            }
        } catch (error) {
            console.error('Error sharing:', error);
            setToast({ message: 'Failed to share event', type: 'error' });
        }
    };

    const [viewMode, setViewMode] = useState<'calendar' | 'list'>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 1023px)').matches ? 'list' : 'calendar';
        }
        return 'calendar';
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia('(max-width: 1023px)').matches) {
                setViewMode('list');
            } else {
                setViewMode('calendar');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const result = await getAllEvents();
                if (result.success && result.events) {
                    const formattedEvents = result.events.map((event: any) => ({
                        ...event,
                        date: new Date(event.date),
                        time: event.time || '10:00 AM',
                        category: event.category || 'cultural',
                        featured: event.featured || false,
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        fetchEvents();
    }, []);

    const categories = [
        { id: 'all', name: 'All Events' },
        { id: 'exhibition', name: 'Exhibitions' },
        { id: 'workshop', name: 'Workshops' },
        { id: 'lecture', name: 'Lectures' },
        { id: 'cultural', name: 'Cultural' },
        { id: 'special', name: 'Special' },
    ];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(event =>
            event.date.toDateString() === date.toDateString()
        );
    };

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - firstDay.getDay());

        const calendar = [];
        let currentWeek: Date[] = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            currentWeek.push(date);
            if (currentWeek.length === 7) {
                calendar.push(currentWeek);
                currentWeek = [];
            }
        }
        return calendar;
    };

    const calendar = generateCalendar();

    const handleDateClick = (date: Date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
        } else {
            setSelectedDate(date);
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto relative" style={{ fontFamily: 'var(--font-body)' }}>
            {/* Grain texture overlay - only on background, not content */}
            <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/tileable-wood-colored.png')",
                    opacity: 0.45,
                }}
            />

            {/* Content wrapper with higher z-index */}
            <div className="relative z-[2]">

            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-4 right-4 z-50 px-6 py-4 max-w-sm transition-all transform"
                    style={{
                        backgroundColor: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                        color: '#fff',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)}><X size={16} /></button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-0 p-6 sm:p-8 pt-32 sm:pt-32"
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
                    borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                }}
            >
                <div>
                    <h2
                        className="text-3xl mb-2"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 500,
                            color: 'var(--color-on-primary)',
                        }}
                    >
                        Satra Events & Calendar
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
                        Discover upcoming exhibitions, workshops, and cultural events
                    </p>
                </div>

                <div className="flex items-center gap-3 order-first lg:order-none">
                    <div
                        className="flex p-1"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 'var(--radius-lg)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        {/* Mobile list button */}
                        <button
                            onClick={() => setViewMode('list')}
                            className="px-4 py-2 flex items-center gap-2 transition-colors lg:hidden"
                            style={{
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.25)' : 'transparent',
                                color: '#fff',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 500,
                                fontSize: '14px',
                            }}
                        >
                            <List size={16} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className="px-4 py-2 flex items-center gap-2 transition-colors"
                            style={{
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: viewMode === 'calendar' ? 'rgba(255,255,255,0.25)' : 'transparent',
                                color: '#fff',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 500,
                                fontSize: '14px',
                            }}
                        >
                            <Grid size={16} /> Calendar
                        </button>
                        {/* Desktop list button */}
                        <button
                            onClick={() => setViewMode('list')}
                            className="px-4 py-2 items-center gap-2 transition-colors hidden lg:flex"
                            style={{
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.25)' : 'transparent',
                                color: '#fff',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 500,
                                fontSize: '14px',
                            }}
                        >
                            <List size={16} /> List
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 my-8 px-5 sm:px-8">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        size={20}
                        style={{ color: 'var(--color-muted)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 transition-all"
                        style={{
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-hairline)',
                            backgroundColor: 'var(--color-canvas)',
                            color: 'var(--color-ink)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="px-4 py-2 text-sm font-medium transition-all"
                            style={{
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-surface-card)',
                                color: selectedCategory === category.id ? 'var(--color-on-primary)' : 'var(--color-ink)',
                                fontFamily: 'var(--font-body)',
                                border: selectedCategory === category.id ? 'none' : '1px solid var(--color-hairline)',
                            }}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-5 sm:px-8 mb-10">
                    {/* Calendar */}
                    <div
                        className="lg:col-span-2 p-6"
                        style={{
                            backgroundColor: 'var(--color-canvas)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-hairline)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-2 transition-colors"
                                style={{ borderRadius: 'var(--radius-md)', color: 'var(--color-ink)' }}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h3
                                className="text-xl"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                            >
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-2 transition-colors"
                                style={{ borderRadius: 'var(--radius-md)', color: 'var(--color-ink)' }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div
                                    key={day}
                                    className="text-center text-sm py-2"
                                    style={{ fontWeight: 500, color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendar.flat().map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const isSelected = selectedDate?.toDateString() === date.toDateString();

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        className="relative min-h-24 p-2 cursor-pointer transition-all"
                                        style={{
                                            borderRadius: 'var(--radius-lg)',
                                            backgroundColor: isCurrentMonth ? 'var(--color-canvas)' : 'var(--color-surface-soft)',
                                            border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline-soft)',
                                            color: isCurrentMonth ? 'var(--color-ink)' : 'var(--color-muted)',
                                        }}
                                    >
                                        <div
                                            className="text-sm"
                                            style={{
                                                fontWeight: 500,
                                                color: isToday ? 'var(--color-primary)' : undefined,
                                            }}
                                        >
                                            {date.getDate()}
                                        </div>
                                        {dayEvents.length > 0 && (
                                            <div className="mt-1 space-y-1">
                                                {dayEvents.slice(0, 2).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-xs p-1 truncate"
                                                        style={{
                                                            borderRadius: 'var(--radius-sm)',
                                                            backgroundColor: event.featured
                                                                ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
                                                                : 'var(--color-surface-card)',
                                                            color: event.featured ? 'var(--color-primary)' : 'var(--color-body)',
                                                        }}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                                        +{dayEvents.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events Sidebar */}
                    <div
                        className="p-6"
                        style={{
                            backgroundColor: 'var(--color-canvas)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-hairline)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3
                                className="text-lg"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                            >
                                {selectedDate
                                    ? `Events on ${selectedDate.toLocaleDateString()}`
                                    : 'Upcoming Events (Next 5)'}
                            </h3>
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-sm px-3 py-1 flex items-center gap-1 transition-colors"
                                    style={{
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--color-surface-card)',
                                        color: 'var(--color-body)',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                >
                                    <X size={14} /> Show All
                                </button>
                            )}
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2">
                            {(selectedDate
                                ? getEventsForDate(selectedDate)
                                : [...events].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5)
                            ).map(event => (
                                <div
                                    key={event.id}
                                    className="p-4 cursor-pointer transition-all"
                                    style={{
                                        borderRadius: 'var(--radius-lg)',
                                        backgroundColor: 'var(--color-surface-soft)',
                                    }}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 style={{ fontWeight: 500, color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>
                                            {event.title}
                                        </h4>
                                    </div>
                                    <div className="text-xs space-y-1" style={{ color: 'var(--color-muted)' }}>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} /> {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} /> {event.location}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span
                                            className="px-2 py-1 text-xs"
                                            style={{
                                                borderRadius: 'var(--radius-pill)',
                                                backgroundColor: 'var(--color-surface-card)',
                                                color: 'var(--color-body-strong)',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="space-y-4 px-5 sm:px-8 mb-10">
                    {filteredEvents.map(event => (
                        <div
                            key={event.id}
                            className="p-6 cursor-pointer transition-all"
                            style={{
                                backgroundColor: 'var(--color-canvas)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-hairline)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3
                                                className="text-xl mb-1"
                                                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                                            >
                                                {event.title}
                                            </h3>
                                            <p className="text-sm" style={{ color: 'var(--color-body)' }}>
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2" style={{ color: 'var(--color-body)' }}>
                                            <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                                            {event.date.toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2" style={{ color: 'var(--color-body)' }}>
                                            <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-2" style={{ color: 'var(--color-body)' }}>
                                            <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                    <span
                                        className="px-3 py-1 text-sm"
                                        style={{
                                            borderRadius: 'var(--radius-pill)',
                                            backgroundColor: 'var(--color-surface-card)',
                                            color: 'var(--color-body-strong)',
                                            fontWeight: 500,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                >
                    <div
                        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--color-canvas)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                        }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2
                                    className="text-2xl"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                                >
                                    {selectedEvent.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    style={{ color: 'var(--color-muted)' }}
                                    className="transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="mb-6" style={{ color: 'var(--color-body)', lineHeight: 1.6 }}>
                                {selectedEvent.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
                                        <span style={{ color: 'var(--color-ink)' }}>
                                            {selectedEvent.date.toLocaleDateString('en-US', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                                        <span style={{ color: 'var(--color-ink)' }}>{selectedEvent.time}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="px-3 py-1 text-sm"
                                            style={{
                                                borderRadius: 'var(--radius-pill)',
                                                backgroundColor: 'var(--color-surface-card)',
                                                color: 'var(--color-body-strong)',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {selectedEvent.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
                                        <span style={{ color: 'var(--color-ink)' }}>{selectedEvent.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="flex flex-1 items-center justify-center gap-2 py-3 px-6 font-medium transition-colors group"
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-on-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleShare}
                                    onMouseEnter={() => waypointRef.current?.startAnimation()}
                                    onMouseLeave={() => waypointRef.current?.stopAnimation()}
                                >
                                    <WaypointsIcon ref={waypointRef} className="w-1 h-1 mr-6 mb-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-lg">Share Event</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default EventsCalendar;
