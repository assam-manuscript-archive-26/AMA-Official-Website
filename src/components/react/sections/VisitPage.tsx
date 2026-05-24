import React, { useRef, useState, useEffect } from 'react';
import { Send, Phone, CheckCircle, AlertCircle, X } from 'lucide-react';
import { CursorClickIcon } from '@/components/react/ui/CursorClickIcon';
import { MapPinIcon } from '@/components/react/ui/MapPinIcon';
import { AtSignIcon } from '@/components/react/ui/AtSignIcon';
import { createContactSubmission } from '@/backend/actions/contact';
import type { CursorClickIconHandle } from '@/components/react/ui/CursorClickIcon';
import type { MapPinIconHandle } from '@/components/react/ui/MapPinIcon';
import type { AtSignIconHandle } from '@/components/react/ui/AtSignIcon';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    message: string;
}

const VisitPage = () => {
    const cursorRef = useRef<CursorClickIconHandle>(null);
    const mapPinRef = useRef<MapPinIconHandle>(null);
    const emailRef = useRef<AtSignIconHandle>(null);

    const [formData, setFormData] = useState<FormData>({
        fullName: '', email: '', phone: '', message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createContactSubmission({ ...formData, status: 'new', starred: false });
            setFormData({ fullName: '', email: '', phone: '', message: '' });
            setToast({ message: 'Thank you! Your message has been sent successfully.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
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

    const contactCardStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-canvas)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-hairline)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    return (
        <div
            className="py-28 px-4 sm:px-8 md:px-24 lg:px-40"
            style={{
                fontFamily: 'var(--font-body)'
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
                        animation: 'visitSlideIn 0.3s ease-out',
                    }}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span style={{ flex: 1 }}>{toast.message}</span>
                        <button onClick={() => setToast(null)} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', background: 'none', border: 'none' }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-8">
                <h2
                    className="text-4xl mb-4"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                >
                    Visit Assamese Manuscript Archive
                </h2>
                <p style={{ color: 'var(--color-body)', maxWidth: '600px', margin: '0 auto' }}>
                    Step into history and explore ancient manuscripts. Contact us for guided tours, research access, or any inquiries.
                </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl mx-auto">
                <button
                    className="group"
                    style={contactCardStyle}
                    onMouseEnter={(e) => {
                        mapPinRef.current?.startAnimation();
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-primary)';
                        el.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-canvas)';
                        el.style.borderColor = 'var(--color-hairline)';
                    }}
                >
                    <div className="mb-2" style={{ color: 'var(--color-primary)' }}>
                        <MapPinIcon ref={mapPinRef} size={28} />
                    </div>
                    <h3 className="mb-1" style={{ fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '16px' }}>
                        Address
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-body)' }}>
                        Assamese Manuscript Archive, Majuli, Assam, India
                    </p>
                </button>

                <button
                    className="group"
                    style={contactCardStyle}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-primary)';
                        el.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-canvas)';
                        el.style.borderColor = 'var(--color-hairline)';
                    }}
                >
                    <div className="mb-2" style={{ color: 'var(--color-primary)' }}>
                        <Phone size={28} />
                    </div>
                    <h3 className="mb-1" style={{ fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '16px' }}>
                        Phone
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-body)' }}>
                        +91 98765 43210
                    </p>
                </button>

                <button
                    className="group"
                    style={contactCardStyle}
                    onMouseEnter={(e) => {
                        emailRef.current?.startAnimation();
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-primary)';
                        el.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = 'var(--color-canvas)';
                        el.style.borderColor = 'var(--color-hairline)';
                    }}
                    onClick={() => window.location.href = 'mailto:info@assammanuscriptarchive.com'}
                >
                    <div className="mb-2" style={{ color: 'var(--color-primary)' }}>
                        <AtSignIcon ref={emailRef} size={28} />
                    </div>
                    <h3 className="mb-1" style={{ fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '16px' }}>
                        Email
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-body)' }}>
                        info@assammanuscriptarchive.com
                    </p>
                </button>
            </div>

            {/* Virtual Tour Button */}
            <div className="max-w-4xl mx-auto mb-6">
                <a href="/map" style={{ textDecoration: 'none' }}>
                    <button
                        className="w-full flex items-center justify-center gap-2 py-3 text-lg transition-all"
                        style={{
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--color-canvas)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            cursorRef.current?.startAnimation();
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-on-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-canvas)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                    >
                        Virtual Tour
                        <CursorClickIcon ref={cursorRef} className="w-3 h-3" />
                    </button>
                </a>
            </div>

            {/* Map and Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Map */}
                <div
                    className="overflow-hidden"
                    style={{
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-hairline)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    <div className="relative pb-[100%]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.9494672456817!2d91.62025427519629!3d26.13319057712037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a43f4d6353b7d%3A0x5089bf544bea3b23!2sGirijananda%20Chowdhury%20University!5e0!3m2!1sen!2sin!4v1743228907937!5m2!1sen!2sin"
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* Contact Form */}
                <div
                    className="p-8"
                    style={{
                        backgroundColor: 'var(--color-canvas)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-hairline)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    <h3
                        className="text-2xl mb-4"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--color-ink)' }}
                    >
                        Contact Us
                    </h3>
                    <p className="mb-6 text-sm" style={{ color: 'var(--color-body)' }}>
                        Fill out the form below, and our team will get back to you within 24 hours.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" name="fullName" placeholder="Full Name"
                            value={formData.fullName} onChange={handleChange} required
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                        />
                        <input
                            type="email" name="email" placeholder="Email"
                            value={formData.email} onChange={handleChange} required
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                        />
                        <input
                            type="tel" name="phone" placeholder="Phone"
                            value={formData.phone} onChange={handleChange} required
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                        />
                        <textarea
                            rows={5} name="message" placeholder="How can we assist you?"
                            value={formData.message} onChange={handleChange} required
                            style={{ ...inputStyle, resize: 'none' as const, minHeight: '120px' }}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--color-hairline)')}
                        />
                        <button
                            type="submit" disabled={isSubmitting}
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
                            {isSubmitting ? 'Sending...' : (
                                <><Send size={18} /> Send Message</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes visitSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default VisitPage;
