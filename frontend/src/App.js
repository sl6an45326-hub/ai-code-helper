import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('التحقق من الاتصال...');
  const chatEndRef = useRef(null);

  // التمرير التلقائي للأسفل
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // التحقق من حالة الخادم عند بدء التطبيق
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ollama/status`);
      setStatus('✅ متصل - جاهز للعمل');
      setError('');
    } catch (err) {
      setStatus('❌ غير متصل - تأكد من تشغيل Ollama');
      setError('تعذر الاتصال بالخادم. تأكد من تشغيل خادم Ollama.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const userMessage = input;
    setInput('');
    setError('');

    // إضافة رسالة المستخدم
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage
      });

      if (response.data.success) {
        // إضافة رسالة الذكاء الاصطناعي
        setMessages(prev => [...prev, { type: 'ai', text: response.data.response }]);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'حدث خطأ غير متوقع';
      setError(errorMsg);
      setMessages(prev => [...prev, { type: 'error', text: `❌ خطأ: ${errorMsg}` }]);
      setStatus('❌ حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🤖 AI Code Helper</h1>
        <p>مساعدك الذكي لكتابة وتحليل الأكواد</p>
      </div>

      {/* Chat Area */}
      <div className="chat-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
            <h2>👋 مرحباً!</h2>
            <p>ابدأ بطرح سؤالك أو اطلب مساعدة في كتابة الكود</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}-message`}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))
        )}

        {loading && (
          <div className="message ai-message">
            <div className="loading">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form className="input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '⏳ جاري الرد...' : '📤 إرسال'}
        </button>
      </form>

      {/* Status */}
      <div className="status">
        {status}
      </div>
    </div>
  );
}

export default App;
