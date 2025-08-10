import React, { useState, useRef } from 'react';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCM0J-eEojkljwHUaOlSiTvMd2XmF11S4M';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am Gemini Chatbot. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
        }
      );
      const botText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';
      setMessages((msgs) => [...msgs, { role: 'bot', text: botText }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'bot', text: 'Error: Could not connect to Gemini API.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="btn neon-btn"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 9999,
          borderRadius: '50%',
          width: 64,
          height: 64,
          fontSize: 32,
          boxShadow: '0 4px 16px #00f2ff88',
        }}
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {/* Chat Modal */}
      {open && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0,0,0,0.3)', zIndex: 10000 }}
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 400 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div className="modal-header" style={{ background: 'linear-gradient(90deg, #00f2ff 0%, #bb86fc 100%)', color: '#fff' }}>
                <h5 className="modal-title" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Gemini Chatbot</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setOpen(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: 350, overflowY: 'auto', background: '#f8f9fa', padding: 0 }}>
                <div style={{ padding: 16 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`} >
                      <div
                        style={{
                          background: msg.role === 'user' ? 'linear-gradient(90deg, #00f2ff 0%, #bb86fc 100%)' : '#fff',
                          color: msg.role === 'user' ? '#fff' : '#222',
                          borderRadius: 16,
                          padding: '8px 16px',
                          maxWidth: 260,
                          fontSize: 15,
                          boxShadow: msg.role === 'user' ? '0 2px 8px #00f2ff33' : '0 2px 8px #bb86fc22',
                          fontFamily: 'Poppins, Arial, sans-serif',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
              <form className="modal-footer d-flex gap-2" style={{ background: '#f8f9fa' }} onSubmit={handleSend}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  style={{ borderRadius: 16, fontFamily: 'Poppins, Arial, sans-serif' }}
                  autoFocus
                />
                <button type="submit" className="btn neon-btn" disabled={loading || !input.trim()} style={{ borderRadius: 16 }}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 