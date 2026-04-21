// 🤖 AGENT CHAT — new file
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles, X, Send, Bot, User, DollarSign, TrendingUp,
  CheckSquare, Users, ChevronDown, Loader2, AlertCircle, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useChatApi from './useChatApi';

// ── Icon map ───────────────────────────────────────────────
const ICONS = { DollarSign, TrendingUp, CheckSquare, Users };

// ── Agent color map ────────────────────────────────────────
const AGENT_COLORS = {
  payroll:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25', glow: 'rgba(34,197,94,0.3)' },
  performance:  { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/25',    glow: 'rgba(59,130,246,0.3)' },
  task_manager: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25',   glow: 'rgba(245,158,11,0.3)' },
  hr_decision:  { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/25',  glow: 'rgba(139,92,246,0.3)' },
};

export default function AgentChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages, loading, activeAgent, setActiveAgent,
    sendMessage, clearMessages, availableAgents,
  } = useChatApi(user);

  const agents = availableAgents();

  // Auto-select first agent on open
  useEffect(() => {
    if (isOpen && !activeAgent && agents.length > 0) {
      setActiveAgent(agents[0].id);
    }
  }, [isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || !activeAgent || loading) return;
    sendMessage(input.trim(), activeAgent);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const activeAgentInfo = agents.find(a => a.id === activeAgent);
  const AgentIcon = activeAgentInfo ? ICONS[activeAgentInfo.icon] : Bot;
  const agentColors = activeAgent ? AGENT_COLORS[activeAgent] : AGENT_COLORS.payroll;

  return (
    <>
      {/* ── Chat Panel ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '88px',
              right: '24px',
              zIndex: 50,
              width: '380px',
              height: '580px',
              background: 'rgba(10,10,18,0.92)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '20px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-indigo-500/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-100">NexusHR Agents</p>
                  <p className="text-[11px] text-gray-500 leading-none mt-0.5">
                    {activeAgentInfo ? `Talking to ${activeAgentInfo.label} Agent` : 'Select an agent'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="w-7 h-7 rounded-[6px] flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Agent selector tabs */}
            <div className="flex gap-1.5 px-3 py-2.5 border-b border-white/[0.06] flex-shrink-0 overflow-x-auto scrollbar-none">
              {agents.map(agent => {
                const Icon = ICONS[agent.icon];
                const colors = AGENT_COLORS[agent.id];
                const isActive = activeAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent.id)}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-medium
                      whitespace-nowrap flex-shrink-0 border transition-all duration-150
                      ${isActive
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : 'bg-transparent text-gray-500 border-transparent hover:bg-white/[0.04] hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon size={12} />
                    {agent.label}
                  </button>
                );
              })}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div
                    className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-3 ${agentColors.bg}`}
                    style={{ boxShadow: `0 0 24px ${agentColors.glow}` }}
                  >
                    <AgentIcon size={22} className={agentColors.text} />
                  </div>
                  <p className="text-sm font-semibold text-gray-200 mb-1">
                    {activeAgentInfo?.label || 'NexusHR'} Agent
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {activeAgentInfo?.description || 'Select an agent above to get started'}
                  </p>

                  {/* Suggestion chips */}
                  {activeAgent && (
                    <div className="flex flex-col gap-1.5 w-full">
                      {getSuggestions(activeAgent).map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setInput(s); inputRef.current?.focus(); }}
                          className="text-left text-xs text-gray-400 px-3 py-2 rounded-[8px] border border-white/[0.06] hover:bg-white/[0.04] hover:text-gray-200 hover:border-white/10 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message bubbles */}
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`
                    w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5
                    ${msg.role === 'user'
                      ? 'bg-indigo-500/20'
                      : msg.isError ? 'bg-red-500/15' : (AGENT_COLORS[msg.agent]?.bg || 'bg-white/[0.06]')
                    }
                  `}>
                    {msg.role === 'user'
                      ? <User size={11} className="text-indigo-400" />
                      : msg.isError
                        ? <AlertCircle size={11} className="text-red-400" />
                        : <Bot size={11} className={AGENT_COLORS[msg.agent]?.text || 'text-gray-400'} />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`
                      px-3 py-2.5 rounded-[12px] text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-indigo-600/80 text-white rounded-tr-[4px]'
                        : msg.isError
                          ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-[4px]'
                          : 'text-gray-200 rounded-tl-[4px] border border-white/[0.06]'
                      }
                    `}
                    style={msg.role === 'agent' && !msg.isError ? {
                      background: 'rgba(255,255,255,0.04)',
                    } : {}}
                    >
                      {msg.content}
                    </div>

                    {/* Suggestion pills after agent response */}
                    {msg.role === 'agent' && msg.suggestions?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => { setInput(s); inputRef.current?.focus(); }}
                            className="text-[11px] px-2 py-1 rounded-[6px] border border-white/[0.07] text-gray-500 hover:text-gray-200 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-[10px] text-gray-600 px-0.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5 items-center"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${agentColors.bg}`}>
                    <Bot size={11} className={agentColors.text} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-[12px] rounded-tl-[4px] border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Loader2 size={12} className="text-gray-500 animate-spin" />
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-3 pb-3 flex-shrink-0 border-t border-white/[0.06] pt-3">
              <div
                className="flex items-end gap-2 rounded-[12px] border border-white/10 px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={activeAgent ? `Ask the ${activeAgentInfo?.label} agent...` : 'Select an agent first...'}
                  disabled={!activeAgent || loading}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: '80px', overflowY: 'auto' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !activeAgent || loading}
                  className={`
                    w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0
                    transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed
                    ${input.trim() && activeAgent && !loading
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-white/[0.06] text-gray-500'
                    }
                  `}
                >
                  {loading
                    ? <Loader2 size={13} className="animate-spin" />
                    : <Send size={13} />
                  }
                </button>
              </div>
              <p className="text-[10px] text-gray-600 text-center mt-2">
                Enter to send · Shift+Enter for new line
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ───────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: isOpen
            ? 'rgba(99,102,241,0.3)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: isOpen
            ? '0 0 0 1px rgba(99,102,241,0.3)'
            : '0 8px 32px rgba(99,102,241,0.45), 0 0 0 1px rgba(255,255,255,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.div>
            : <motion.div key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sparkles size={22} />
              </motion.div>
          }
        </AnimatePresence>

        {/* Unread pulse dot — shows after receiving an agent reply */}
        {!isOpen && messages.length > 0 && (
          <span
            style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '12px', height: '12px', borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0D0D14',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </motion.button>
    </>
  );
}

// ── Suggestion chips per agent ─────────────────────────────
function getSuggestions(agentId) {
  const map = {
    payroll: [
      'What is my net salary this month?',
      'Show my tax deductions for this year',
      'Calculate my bonus based on performance',
    ],
    performance: [
      'What is my current performance score?',
      'How am I trending compared to last quarter?',
      'Compare me to my peers in the department',
    ],
    task_manager: [
      'Who should I assign my next backend task to?',
      'Show workload distribution for my team',
      'Estimate completion time for current sprint',
    ],
    hr_decision: [
      'Is employee 42 eligible for promotion?',
      'Who are the retention risks in my team?',
      'What HR action do you recommend for this employee?',
    ],
  };
  return map[agentId] || [];
}