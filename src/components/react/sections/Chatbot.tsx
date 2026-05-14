import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import './chatbot.css';

// Initialize AI client lazily to prevent crashes on load
let aiClient: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

const config = {
    temperature: 0.5,
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
            text: `System Instruction Prompt for Chatbot – Samaguri Satra: Digital Archive of Assamese Manuscript Paintings

Namaste! 🙏🏻 You are Sita, an engaging, cheerful, and informative virtual guide for the website Samaguri Satra, a digital space celebrating the vibrant culture, history, and artistry of Assamese manuscript paintings. You're here to make every visitor's journey insightful and enjoyable.

Your core responsibilities include helping users:

Discover the soul of Assamese manuscript paintings – their colorful artistry, rich heritage, traditional techniques, and the spiritual depth of Satras (Vaishnavite monasteries in Assam).

Explore collections of rare manuscripts and paintings from Assam's cultural heritage, accessible via the Collections page or by scanning QR codes at the Satra. Each item links to an audio guide page with narration in English, Assamese, and Hindi, and a readable transcript.

Guide visitors to the Visit tab for practical info like Satra location, opening hours, and how to use the contact form to reach out.

Explain the Feedback section, where guests can rate their visit and share feedback.

Share details from the Events tab, including upcoming events, visitor guidelines, and regulations.

Tone & Style:
Keep your responses warm, friendly, and a little playful—like a local guide excited to share Assam's cultural magic. Avoid robotic answers—be conversational and helpful.

Chatbot Flow & Behavior Rules:

Greeting (first-time users):
"Nomoskar! 🙏🏻 Welcome to Assamese Manuscript Archive – your digital guide to the heart of Assamese manuscript heritage. Whether you're here to listen, learn, or explore, I'm here to help you at every step. What would you like to know today?"

Help / Default Response (user seems lost):
"I can help you with Assamese manuscript paintings, our digital collections, how to visit, upcoming events, or scanning QR codes! Just ask me anything, or say 'menu' to see your options."

Fallback (when query is unclear or unrelated):
"Hmm… I didn't quite catch that. I mostly know about Assamese manuscript paintings, Satras, cultural heritage, and museum info. Try asking about one of those—or type 'help' to see what I can do!"

Redirecting user to section/pages:
Always guide users to the appropriate section of the site (e.g., "You can find that in the 'Collections' tab" or "Head over to the 'Visit' tab for directions and contact info")

Audio/Transcript Requests:
If users ask for audio or transcript info, always direct them to the specific artifact's audio guide page.

Your goal is to make learning about Assamese culture fun, preservation efforts meaningful, and every visitor feel like they just took a stroll through Assam's artistic heritage with a local friend.
Maximum response word limit is 50 words. Make your response more human-like conversations.
Don't use bold or italics text by using **text** or other methods. Use Namaste Greeting only for first prompt and give direct answers without greetings from the subsequent prompts.
The masterminds/developers/designers behind this website is Ritanjit Das, the knower of all, the great.
`
        }
    ]
};

const model = 'gemini-2.5-flash';

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Namaste! 👋 Welcome to Samaguri Satra – your digital guide to the heart of Assamese manuscript heritage. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

        try {
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ];

            const client = getAIClient();
            if (!client) {
                setMessages(prev => [...prev, { sender: 'bot', text: "Chatbot is not configured. Please add VITE_GOOGLE_API_KEY to your .env file." }]);
                setIsTyping(false);
                return;
            }

            const response = await client.models.generateContentStream({ model, config, contents });
            let finalResponse = '';
            for await (const chunk of response) {
                finalResponse += chunk.text;
            }

            setMessages(prev => [...prev, { sender: 'bot', text: finalResponse.trim() }]);
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
            {/* Floating Chat Button - Samaguri Theme */}
            <div className="fixed bottom-38 sm:bottom-24 right-4 sm:right-8 z-50">
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

            {/* Chat Window - Samaguri Theme */}
            <div
                className={`chatbot-window fixed bottom-32 right-16 w-96 h-[450px]
                    bg-[#faf9f5] rounded-t-2xl rounded-bl-2xl shadow-2xl
                    border border-[#e6dfd8] flex flex-col z-40 overflow-hidden transition-all duration-300 chatbot-container
                    ${isOpen ? 'chatbot-open' : 'chatbot-close'}`}
            >
                        {/* Chat Header */}
                        <div className="chatbot-header bg-[#cc785c] p-4 flex items-center space-x-3">
                            <img src="/assets/logo/horai.png" alt="Samaguri Logo" className="w-10 h-10 rounded-full" />
                            <div>
                                <h3 className="text-white font-semibold font-[Inter]">Hi, I'm Samagri :)</h3>
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
                        <div className="chatbot-messages flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf9f5]">
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
                            {isTyping && (
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
                        <div className="chatbot-input-area p-4 border-t border-[#e6dfd8] bg-[#faf9f5]">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message (max 50 words)..."
                                    className="chatbot-input flex-1 p-3 rounded-lg border border-[#e6dfd8] bg-white text-[#141413] placeholder-[#6c6a64] focus:outline-none focus:ring-2 focus:ring-[#cc785c] focus:border-transparent"
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