import React, { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws-chat';

const ChatWidget = ({ user, open, setOpen }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const stompClient = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && !stompClient.current) {
      const socket = new SockJS(WS_URL);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        stompClient.current.subscribe('/topic/messages', (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
        });
      });
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
        stompClient.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (open) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !stompClient.current || !stompClient.current.connected) return;
    setLoading(true);
    const msg = {
      sender: user?.name || 'Anonymous',
      recipient: '', // For now, broadcast
      content: input,
      timestamp: Date.now(),
    };
    stompClient.current.send('/app/chat', {}, JSON.stringify(msg));
    setInput('');
    setLoading(false);
  };

  return (
    <>
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
                <h5 className="modal-title" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Teacher-Student Chat</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setOpen(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: 350, overflowY: 'auto', background: '#f8f9fa', padding: 0 }}>
                <div style={{ padding: 16 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 d-flex ${msg.sender === (user?.name || 'Anonymous') ? 'justify-content-end' : 'justify-content-start'}`} >
                      <div
                        style={{
                          background: msg.sender === (user?.name || 'Anonymous') ? 'linear-gradient(90deg, #00f2ff 0%, #bb86fc 100%)' : '#fff',
                          color: msg.sender === (user?.name || 'Anonymous') ? '#fff' : '#222',
                          borderRadius: 16,
                          padding: '8px 16px',
                          maxWidth: 260,
                          fontSize: 15,
                          boxShadow: msg.sender === (user?.name || 'Anonymous') ? '0 2px 8px #00f2ff33' : '0 2px 8px #bb86fc22',
                          fontFamily: 'Poppins, Arial, sans-serif',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#00bcd4' }}>{msg.sender}</span>
                        <br />
                        {msg.content}
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

export default ChatWidget; 