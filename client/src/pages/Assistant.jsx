import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Bot, User, Plus, MessageSquare, Laptop, Headphones, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../services/api';
import './Assistant.css';

const SUGGESTED_PROMPTS = [
  {
    icon: <Laptop size={20} />,
    title: "Gaming Laptops",
    desc: "Find the best gaming laptop under ₹150,000",
    query: "Find the best gaming laptop under 150000"
  },
  {
    icon: <Headphones size={20} />,
    title: "Noise Cancelling",
    desc: "Recommend headphones for traveling and flights",
    query: "Recommend noise cancelling headphones for traveling and flights"
  },
  {
    icon: <Sparkles size={20} />,
    title: "Camera Comparison",
    desc: "Compare the cameras of iPhone 15 Pro and S24 Ultra",
    query: "Compare the cameras of iPhone 15 Pro Max and Galaxy S24 Ultra"
  },
  {
    icon: <MessageSquare size={20} />,
    title: "Smartwatches",
    desc: "What's the best smartwatch for fitness tracking?",
    query: "What's the best smartwatch for fitness tracking?"
  }
];

export default function Assistant() {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || '';
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery);
    }
  }, []);

  const handleSend = async (textOverride) => {
    const text = typeof textOverride === 'string' ? textOverride : input;
    if (!text.trim()) return;

    const userMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(text, history);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: response.text
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I encountered an error connecting to my server. Please try again.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="assistant-layout">
      {/* Header */}
      <header className="ai-header">
        <div className="header-left">
          <button className="theme-toggle-btn">
            <Sparkles size={20} />
          </button>
          <div className="header-title">
            <span className="title-bold">ShopSmart AI</span> | <span className="title-light">Google Codelabs</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-badge">User: Demo Guest</div>
          <button className="header-text-btn" onClick={handleClear}>Clear Session</button>
          <a href="/" className="header-text-btn">Main Page</a>
        </div>
      </header>

      {/* Main Area */}
      <main className="assistant-main">
        <div className="chat-scroll-area">
          <div className="messages-list">
            
            {/* Initial Welcome Message */}
            {messages.length === 0 && (
              <motion.div 
                className="message-row assistant"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="message-content-wrapper">
                  <div className="message-avatar assistant">
                    <Bot size={20} />
                  </div>
                  <div className="message-bubble">
                    <div className="message-text">
                      Hi! I have loaded the instructions and catalog for the ShopSmart store. How can I help you today?
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  className={`message-row ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content-wrapper">
                    <div className={`message-avatar ${msg.role}`}>
                      {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="message-bubble">
                      <div className={`message-text markdown-body ${msg.isError ? 'error' : ''}`}>
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  className="message-row assistant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-content-wrapper">
                    <div className="message-avatar assistant"><Bot size={20} /></div>
                    <div className="message-bubble">
                      <div className="loading-indicator">
                        <motion.div className="loading-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} />
                        <motion.div className="loading-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }} />
                        <motion.div className="loading-dot" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-container-wrapper">
          <div className="knowledge-point-wrapper">
            <button className="knowledge-point-btn">
              💡 Knowledge point
            </button>
          </div>
          
          <form 
            className="chat-input-form"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <button type="button" className="chat-add-btn">
              <Plus size={20} />
            </button>
            <textarea
              className="chat-textarea"
              placeholder="Ask a question about the products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <button 
               type="submit" 
               className="chat-send-btn"
               disabled={!input.trim() || isLoading}
            >
              <div className="send-arrow-icon">^</div>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
