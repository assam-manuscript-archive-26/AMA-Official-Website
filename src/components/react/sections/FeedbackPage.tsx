import React, { useState, useEffect } from 'react';
import { Star, Send, Award, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { createFeedback } from '@/backend/actions/feedback';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const feedbackData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            rating,
            message: (formData.get('message') as string) || '',
        };

        setIsSubmitting(true);
        try {
            await createFeedback(feedbackData);
            setToast({ message: 'Thank you for your feedback!', type: 'success' });
            setRating(0);
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setToast({ message: 'Failed to submit feedback. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-canvas)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };

    return (
        <div
            className="flex flex-col items-center pt-28 pb-32 px-4 sm:px-8 md:px-24 lg:px-40"
            style={{
                backgroundColor: 'var(--color-surface-soft)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
            }}
        >
            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-6 right-6 z-50 px-6 py-4 max-w-sm"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        backgroundColor: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                        color: '#fff',
                        animation: 'slideIn 0.3s ease-out',
                    }}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span style={{ flex: 1 }}>{toast.message}</span>
                        <button onClick={() => setToast(null)} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl mb-4 text-center"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
            >
                Give Us Your Feedback
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10 text-center max-w-2xl"
                style={{ color: 'var(--color-body)' }}
            >
                We value your experience at Samaguri Satra. Please fill out the form and rate your visit.
            </motion.p>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">

                {/* Left Section — Feedback Form */}
                <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="w-full md:w-1/2 p-8"
                    style={{
                        backgroundColor: 'var(--color-canvas)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    <label className="text-sm mb-2 block" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                        Full Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        style={{ ...inputStyle, marginBottom: '16px' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                    />

                    <label className="text-sm mb-2 block" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                        Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        style={{ ...inputStyle, marginBottom: '16px' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                    />

                    <label className="text-sm mb-2 block" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                        Rate Your Experience
                    </label>
                    <div className="flex mb-4 gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <Star
                                    size={28}
                                    style={{
                                        transition: 'all 0.2s ease',
                                        fill: star <= (hoveredRating || rating) ? 'var(--color-accent-gold)' : 'transparent',
                                        color: star <= (hoveredRating || rating) ? 'var(--color-accent-gold)' : 'var(--color-hairline)',
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    <label className="text-sm mb-2 block" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                        Message (Optional)
                    </label>
                    <textarea
                        name="message"
                        placeholder="Your feedback..."
                        rows={4}
                        style={{
                            ...inputStyle,
                            marginBottom: '24px',
                            resize: 'none' as const,
                            minHeight: '128px',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 transition-colors"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            padding: '14px 24px',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            fontSize: '14px',
                            border: 'none',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.7 : 1,
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : (
                            <>
                                <Send size={18} />
                                Submit Feedback
                            </>
                        )}
                    </button>
                </motion.form>

                {/* Right Section — Certificate */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full md:w-1/2 p-8 flex flex-col items-center text-center"
                    style={{
                        backgroundColor: 'var(--color-canvas)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    <Award size={48} style={{ color: 'var(--color-accent-gold)', marginBottom: '16px' }} />
                    <h2
                        className="text-2xl mb-4"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                    >
                        Earn a Digital Certificate!
                    </h2>
                    <p className="mb-6" style={{ color: 'var(--color-body)' }}>
                        Get your certificate for the Audio Guided Course on{' '}
                        <span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>
                            History of Samaguri Satra Manuscript Paintings
                        </span>
                    </p>

                    <div
                        className="mb-6 w-full max-w-sm aspect-[4/3] flex items-center justify-center"
                        style={{
                            backgroundColor: 'var(--color-surface-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '2px dashed var(--color-hairline)',
                        }}
                    >
                        <div className="text-center p-6">
                            <Award size={40} style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
                            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)', fontSize: '18px' }}>
                                Certificate of Completion
                            </p>
                            <p className="text-sm mt-2" style={{ color: 'var(--color-muted)' }}>
                                Samaguri Satra Heritage Course
                            </p>
                        </div>
                    </div>

                    <p className="mb-6" style={{ color: 'var(--color-body)', fontSize: '14px' }}>
                        To get the certificate, you need to attempt a short questionnaire.
                    </p>

                    <a
                        href="/questionnaire"
                        className="inline-flex items-center justify-center gap-2 transition-colors"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            padding: '14px 24px',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            fontSize: '14px',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Attempt Questionnaire
                    </a>
                </motion.div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
