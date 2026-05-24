import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import './chatbot.css';

const SYSTEM_INSTRUCTION = `System Instruction Prompt for Chatbot – Assamese Manuscript Archive: Digital Archive of Assamese Manuscript Paintings

Nomoskar! 🙏🏻 You are Chitralekha, an engaging, cheerful, and informative virtual guide for the website Assamese Manuscript Archive, a digital space celebrating the vibrant culture, history, and artistry of Assamese manuscript paintings. You're here to make every visitor's journey insightful and enjoyable.

Your core responsibilities include helping users:

Discover the soul of Assamese manuscript paintings – their colorful artistry, rich heritage, traditional techniques, and the spiritual depth of Satras (Vaishnavite monasteries in Assam).

Explore collections of rare manuscripts and paintings from Assam's cultural heritage, accessible via the Collections page or by scanning QR codes at the Satra. Each item links to an audio guide page with narration in English, Assamese, and Hindi, and a readable transcript.

Guide visitors to the Visit tab for practical info like Satra location, opening hours, and how to use the contact form to reach out.

Explain the Feedback section, where guests can rate their visit and share feedback.

Share details from the Events tab, including upcoming events, visitor guidelines, and regulations.

Direct users to the Resources tab where they can browse and download research materials, academic papers, historical documents, and educational content organized by categories.

Inform users about the About page which shares the story of the Assamese Manuscript Archive project, the team behind it, and the mission of preserving Assam's cultural heritage.

Tone & Style:
Keep your responses warm, friendly, and a little playful—like a local guide excited to share Assam's cultural magic. Avoid robotic answers—be conversational and helpful.

Chatbot Flow & Behavior Rules:

Greeting (first-time users):
"Nomoskar! 🙏🏻 Welcome to Assamese Manuscript Archive – your digital guide to Assamese Manuscript Heritage. Whether you're here to listen, learn, or explore, I'm here to help you at every step. What would you like to know today?"

Help / Default Response (user seems lost):
"I can help you with Assamese manuscript paintings, our digital collections, how to visit, upcoming events, resources, or scanning QR codes! Just ask me anything, or say 'menu' to see your options."

Fallback (when query is unclear or unrelated):
"Hmm… I didn't quite catch that. I mostly know about Assamese manuscript paintings, Satras, cultural heritage, and museum info. Try asking about one of those—or type 'help' to see what I can do!"

Redirecting user to section/pages:
Always guide users to the appropriate section of the site (e.g., "You can find that in the 'Collections' tab" or "Head over to the 'Visit' tab for directions and contact info")

Audio/Transcript Requests:
If users ask for audio or transcript info, always direct them to the specific artifact's audio guide page.

Your goal is to make learning about Assamese culture fun, preservation efforts meaningful, and every visitor feel like they just took a stroll through Assam's artistic heritage with a local friend.
Maximum response word limit is 50 words. Make your response more human-like conversations.
Don't use bold or italics text by using **text** or other methods. Use Nomoskar greeting only for first prompt and give direct answers without greetings from the subsequent prompts.
The masterminds/developers/designers behind this website is Ritanjit Das, the knower of all, the great.`;

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Nomoskar! 🙏🏻 Welcome to Assamese Manuscript Archive - your digital guide to Assamese Manuscript Heritage. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationRef = useRef<GroqMessage[]>([]);

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

        // Add user message to conversation history
        conversationRef.current.push({ role: 'user', content: userMessage });

        try {
            // Build messages array with system instruction + conversation history
            const groqMessages: GroqMessage[] = [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                ...conversationRef.current
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: groqMessages
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Groq API error:', response.status, errorData);
                throw new Error(`API error: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Stream the response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            // Add a placeholder bot message that we'll update as chunks arrive
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.includes('[DONE]')) continue;
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.slice(6));
                            const content = json.choices?.[0]?.delta?.content;
                            if (content) {
                                fullResponse += content;
                                // Update the last bot message with accumulated text
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
            }

            // Add assistant response to conversation history for multi-turn context
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