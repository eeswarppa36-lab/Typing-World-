import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  Trash2, 
  LifeBuoy, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  FileQuestion
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  imageUrl?: string;
  timestamp: string;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am Abhith Help. How can I help you with Typing World today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedMimeType, setAttachedMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image/screenshot file.');
      return;
    }

    setAttachedMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query || 'What is shown in this screenshot and what should I do?',
      imageUrl: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    const currentAttachedImage = attachedImage;
    const currentMimeType = attachedMimeType;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      // Build conversation history for context (up to last 8 messages)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-8)
        .map((m) => ({
          role: m.sender,
          text: m.text,
        }));

      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          image: currentAttachedImage,
          mimeType: currentMimeType,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error.');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'I am ready to help! Please provide more details or ask another question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Graceful local fallback if offline or server issue
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: currentAttachedImage 
          ? `Here is step-by-step guidance based on Typing World app rules:
1. **If a Level is Locked (🔒 icon)**: All levels unlock sequentially. Complete Level 1 (Keyboard Basics) to 100% completion to unlock Level 2.
2. **If You Forgot Your Password**: Use the "Forgot Password?" link on the login screen to verify your Date of Birth and Village Name.
3. **If You Need Simple Steps**: Just ask and I will break down each step in simple terms!`
          : `Here are quick steps to navigate Typing World:
1. **Levels**: Step-by-step touch typing lessons starting with Level 1.
2. **Typing Test**: 60-second test measuring your words per minute (WPM).
3. **Practice**: Free keyboard drills.
What specific feature would you like help with?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimplerWords = (lastAssistantText: string) => {
    handleSendMessage(`Please explain your previous answer in much simpler words with very easy numbered steps:\n"${lastAssistantText.slice(0, 140)}..."`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[92vh] overflow-hidden text-left relative">
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Abhith Help</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Help"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QUICK SUGGESTION PILLS */}
        <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            type="button"
            onClick={() => handleSendMessage('How do I unlock Level 2? Give me step-by-step instructions.')}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            Unlock Level 2
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('లెవెల్ 2 ఎలా అన్‌లాక్ చేయాలి? స్టెప్ బై స్టెప్ చెప్పండి.')}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            తెలుగులో సహాయం (Telugu)
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('टाइपिंग टेस्ट कैसे शुरू करें? स्टेप बाय स्टेप समझाइए।')}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            हिंदी में मदद (Hindi)
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('How do I take a Typing Test?')}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            Typing Test Guide
          </button>
        </div>

        {/* MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-sm'
                    : 'bg-slate-100/90 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Image attachment inside message */}
                {m.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-black/10 max-h-48">
                    <img
                      src={m.imageUrl}
                      alt="Uploaded screenshot"
                      className="w-full h-auto object-contain bg-black/5"
                    />
                  </div>
                )}

                <p className="whitespace-pre-line leading-relaxed font-sans">
                  {m.text}
                </p>

                <div
                  className={`text-[10px] pt-0.5 flex items-center justify-between ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{m.timestamp}</span>

                  {/* "Explain in simpler words" button on assistant messages */}
                  {m.sender === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleSimplerWords(m.text)}
                      className="text-[10px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer ml-3"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Simpler words</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-slate-50 rounded-xl w-fit border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Analyzing and formulating step-by-step guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ATTACHED SCREENSHOT PREVIEW BAR */}
        {attachedImage && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={attachedImage}
                alt="Selected screenshot"
                className="w-10 h-10 rounded-lg object-cover border border-slate-300"
              />
              <span className="text-xs text-slate-600 font-medium">Screenshot attached</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-200 transition-colors"
              title="Remove attachment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INPUT BAR */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          {/* File picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach screenshot or photo"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Ask a question (English, Telugu, Hindi...)"
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400 font-sans"
          />

          <button
            type="button"
            disabled={(!inputQuery.trim() && !attachedImage) || isLoading}
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
