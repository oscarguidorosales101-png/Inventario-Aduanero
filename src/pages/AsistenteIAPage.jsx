import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Database,
  Terminal,
  HelpCircle,
  RefreshCw,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { apiService } from '../services/api';
import { useCustoms } from '../context/CustomsContext';

export default function AsistenteIAPage() {
  const { isLiveBackend } = useCustoms();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: '¡Hola! Soy el Agente de Inteligencia Artificial para el Sistema de Inventario Aduanero. Puedo consultar información oficial sobre declaraciones (DUA), existencias en bodegas, contenedores, inspecciones físicas y partidas arancelarias. ¿Qué consulta deseas realizar?',
      timestamp: 'Ahora',
      sqlQuery: null
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const samplePrompts = [
    '¿Cuántas declaraciones se registraron en octubre?',
    '¿Qué mercancías siguen retenidas y en qué bodega están?',
    '¿Cuál es el país de origen con más contenedores recibidos?',
    '¿Qué inspecciones tuvieron observaciones y quién las realizó?'
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMessageId = Date.now();
    const newUserMsg = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await apiService.askAIAssistant(query, messages);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.answer,
        sqlQuery: response.sqlQuery,
        data: response.data,
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'Ocurrió un inconveniente al comunicarse con el servicio de IA o la base de datos. Por favor verifica que la API o n8n se encuentren activos.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: 520 }}>
      {/* Banner de Estado del Agente */}
      <div
        style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)' }}>
              Agente Aduanero LLM (Laboratorio #3 / n8n Workflow)
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              Consultas SQL automáticas de solo lectura (SELECT) sobre las 13 entidades
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span className="badge badge-liberada">
            <Database size={12} />
            <span>{isLiveBackend ? 'PostgreSQL Conectado' : 'Modo Contextual Demo'}</span>
          </span>
        </div>
      </div>

      {/* Caja de Conversación */}
      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Historial de Mensajes */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  maxWidth: '85%',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  flexDirection: isUser ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isUser ? 'var(--text-main)' : 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Burbuja de Texto */}
                <div>
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      backgroundColor: isUser ? 'var(--primary)' : 'var(--bg-surface-alt)',
                      color: isUser ? '#ffffff' : 'var(--text-main)',
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      boxShadow: 'var(--shadow-sm)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}

                    {/* Sentencia SQL ejecutada por el agente */}
                    {msg.sqlQuery && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#0f172a',
                          color: '#f8fafc',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11.5,
                          overflowX: 'auto',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Terminal size={12} />
                          <span>Consulta SQL ejecutada por el agente:</span>
                        </div>
                        <code>{msg.sqlQuery}</code>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--text-subtle)',
                      marginTop: 4,
                      textAlign: isUser ? 'right' : 'left',
                      padding: '0 4px'
                    }}
                  >
                    {msg.timestamp} {msg.source && `· ${msg.source}`}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Indicador de pensamiento */}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignSelf: 'flex-start', alignItems: 'center' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <RefreshCw size={14} className="spin-animation" style={{ color: 'var(--primary)' }} />
                <span>Consultando modelo relacional y generando respuesta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias Rápidas */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            gap: 8,
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            Sugerencias:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11.5, whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
              disabled={loading}
            >
              <Sparkles size={12} style={{ color: 'var(--primary)' }} />
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Formulario de Entrada */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#ffffff' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: 12 }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Pregunta en lenguaje natural sobre declaraciones, retenciones o inventario..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              style={{ fontSize: 14 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !inputQuery.trim()}
              style={{ minWidth: 110 }}
            >
              <Send size={16} />
              <span>Preguntar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
