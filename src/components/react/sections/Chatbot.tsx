import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import './chatbot.css';

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

type Language = 'english' | 'assamese' | null;

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Nomoskar! 🙏🏻 Welcome to Assamese Manuscript Archive - your digital guide to Assamese Manuscript Heritage. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [language, setLanguage] = useState<Language>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationRef = useRef<ChatMessage[]>([]);

    const showLanguageSelector = messages.length === 1;

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInput(text);
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        if (wordCount > 50) {
            setMessages(prev => [...prev,
            { sender: 'bot', text: "Please keep your questions under 50 words for better assistance." }
            ]);
            return;
        }

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setWordCount(0);
        setIsTyping(true);

        conversationRef.current.push({ role: 'user', content: userMessage });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: conversationRef.current,
                    language
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Chat API error:', response.status, errorData);
                throw new Error(`API error: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let buffer = '';

            // Add a placeholder bot message that we'll update as chunks arrive
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // SSE events are separated by a blank line. Per the spec, line
                // endings can be CRLF or LF — Gemini sends CRLF, so a literal
                // '\n\n' split never matches and the buffer grows forever.
                const events = buffer.split(/\r?\n\r?\n/);
                buffer = events.pop() ?? '';

                for (const evt of events) {
                    const dataLines = evt.split(/\r?\n/).filter(l => l.startsWith('data: '));
                    if (dataLines.length === 0) continue;
                    const payload = dataLines.map(l => l.slice(6)).join('');
                    if (!payload || payload === '[DONE]') continue;
                    try {
                        const json = JSON.parse(payload);
                        const parts = json.candidates?.[0]?.content?.parts;
                        if (Array.isArray(parts)) {
                            for (const part of parts) {
                                if (typeof part?.text === 'string') {
                                    fullResponse += part.text;
                                }
                            }
                            setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { sender: 'bot', text: fullResponse };
                                return updated;
                            });
                        }
                    } catch {
                        // Skip malformed JSON chunks
                    }
                }
            }

            conversationRef.current.push({ role: 'assistant', content: fullResponse.trim() });

            // Keep conversation history manageable (last 20 messages)
            if (conversationRef.current.length > 20) {
                conversationRef.current = conversationRef.current.slice(-20);
            }

        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev,
            { sender: 'bot', text: "Sorry, I encountered an error. Please try again." }
            ]);
        }

        setIsTyping(false);
    };

    return (
        <>
            {/* Floating Chat Button - Assamese Manuscript Archive Theme */}
            <div className="fixed bottom-38 sm:bottom-24 right-4 sm:right-8 z-[60]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="chatbot-floating-btn w-12 h-12 flex items-center justify-center rounded-full
                    bg-[#cc785c] hover:bg-[#a9583e] hover:scale-[1.1] text-white dark:text-white
                    backdrop-blur-lg transition-all shadow-xl cursor-pointer"
                    aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
                >
                    {isOpen ? (
                        <X className="chatbot-icon h-5 w-5 transition-all" />
                    ) : (
                        <MessageCircle className="chatbot-icon h-5 w-5 transition-all" />
                    )}
                </button>
            </div>

            {/* Chat Window - Responsive: full-width on mobile, fixed-width on desktop */}
            <div
                className={`chatbot-window fixed z-[60] overflow-hidden flex flex-col
                    chatbot-container transition-all duration-300
                    /* Mobile: near-fullscreen */
                    bottom-28 left-3 right-3 h-[calc(100vh-10rem)]
                    /* Desktop: anchored to bottom-right */
                    sm:bottom-32 sm:left-auto sm:right-16 sm:w-96 sm:h-[450px]
                    bg-[#faf9f5] rounded-2xl sm:rounded-t-2xl sm:rounded-bl-2xl sm:rounded-br-none shadow-2xl
                    border border-[#e6dfd8]
                    ${isOpen ? 'chatbot-open' : 'chatbot-close'}`}
            >
                        {/* Chat Header */}
                        <div className="chatbot-header bg-[#cc785c] p-4 flex items-center space-x-3 flex-shrink-0">
                            <img src="/assets/logo/horai.png" alt="Assamese Manuscript Archive Logo" className="w-10 h-10 rounded-full" />
                            <div>
                                <h3 className="text-white font-semibold font-[Inter]" style={{ fontSize: '30px' }}>Hi, I'm Chitralekha :)</h3>
                                <p className="text-white/80 text-sm">Ask me anything</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="chatbot-close-btn ml-auto text-white/80 hover:text-red-500 cursor-pointer"
                                aria-label="Close chatbot"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Container */}
                        <div className="chatbot-messages flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf9f5] min-h-0">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user'
                                            ? 'chatbot-user-msg bg-[#cc785c] text-white'
                                            : 'chatbot-bot-msg bg-[#efe9de] text-[#141413] border border-[#e6dfd8]'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {showLanguageSelector && (
                                <div className="chatbot-lang-selector flex justify-start">
                                    <div className="flex flex-col gap-2 max-w-[80%]">
                                        <span className="chatbot-lang-label text-[11px] uppercase tracking-[0.14em] text-[#8a7a6e] font-medium pl-1">
                                            Choose a language
                                        </span>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => setLanguage('english')}
                                                className={`chatbot-lang-pill group relative px-4 py-2 rounded-full border text-sm transition-all duration-200 cursor-pointer ${language === 'english'
                                                    ? 'bg-[#cc785c] border-[#cc785c] text-white shadow-[0_2px_8px_rgba(204,120,92,0.25)]'
                                                    : 'bg-transparent border-[#d8cebf] text-[#5c4a3e] hover:border-[#cc785c] hover:text-[#cc785c]'
                                                    }`}
                                                aria-pressed={language === 'english'}
                                            >
                                                <span className="font-medium">English</span>
                                                <span className={`ml-2 text-[11px] ${language === 'english' ? 'text-white/70' : 'text-[#a89886]'}`}>
                                                    EN
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setLanguage('assamese')}
                                                className={`chatbot-lang-pill group relative px-4 py-2 rounded-full border text-sm transition-all duration-200 cursor-pointer ${language === 'assamese'
                                                    ? 'bg-[#cc785c] border-[#cc785c] text-white shadow-[0_2px_8px_rgba(204,120,92,0.25)]'
                                                    : 'bg-transparent border-[#d8cebf] text-[#5c4a3e] hover:border-[#cc785c] hover:text-[#cc785c]'
                                                    }`}
                                                aria-pressed={language === 'assamese'}
                                            >
                                                <span className="font-medium">অসমীয়া</span>
                                                <span className={`ml-2 text-[11px] ${language === 'assamese' ? 'text-white/70' : 'text-[#a89886]'}`}>
                                                    AS
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isTyping && messages[messages.length - 1]?.text === '' && (
                                <div className="flex justify-start">
                                    <div className="chatbot-bot-msg bg-[#efe9de] rounded-lg p-3 text-[#141413] border border-[#e6dfd8]">
                                        <div className="flex space-x-1">
                                            <div className="chatbot-typing-dot w-2 h-2 bg-[#cc785c] rounded-full animate-bounce"></div>
                                            <div className="chatbot-typing-dot w-2 h-2 bg-[#cc785c] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="chatbot-typing-dot w-2 h-2 bg-[#cc785c] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="chatbot-input-area p-3 sm:p-4 border-t border-[#e6dfd8] bg-[#faf9f5] flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message (max 50 words)..."
                                    className="chatbot-input flex-1 p-3 rounded-lg border border-[#e6dfd8] bg-white text-[#141413] placeholder-[#6c6a64] focus:outline-none focus:ring-2 focus:ring-[#cc785c] focus:border-transparent text-sm sm:text-base"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="chatbot-send-btn bg-[#cc785c] hover:bg-[#a9583e] text-white p-3 rounded-lg disabled:bg-[#e6dfd8] disabled:text-[#6c6a64] disabled:cursor-not-allowed transition"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
            </>
    );
}
