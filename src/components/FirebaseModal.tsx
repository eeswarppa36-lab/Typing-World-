import React, { useState } from 'react';
import { X, ShieldCheck, Key, ExternalLink, Copy, Check } from 'lucide-react';
import { defaultFirebaseConfig, isFirebaseConfigured } from '../config/firebaseConfig';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateGoogleSignIn?: (email: string, name: string) => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  onSimulateGoogleSignIn
}) => {
  const [copied, setCopied] = useState(false);
  const [customEmail, setCustomEmail] = useState('eeswarppa36@gmail.com');
  const configured = isFirebaseConfigured();

  if (!isOpen) return null;

  const envSample = `# Typing World — Firebase Configuration
# Paste these variables in your root .env file:
VITE_FIREBASE_API_KEY="${defaultFirebaseConfig.apiKey || 'AIzaSyDemoKeyExample123456789'}"
VITE_FIREBASE_AUTH_DOMAIN="${defaultFirebaseConfig.authDomain}"
VITE_FIREBASE_PROJECT_ID="${defaultFirebaseConfig.projectId}"
VITE_FIREBASE_STORAGE_BUCKET="${defaultFirebaseConfig.storageBucket}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${defaultFirebaseConfig.messagingSenderId}"
VITE_FIREBASE_APP_ID="${defaultFirebaseConfig.appId}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Firebase Authentication Setup</h3>
            <p className="text-xs text-slate-400">Google Sign-In & Security Configuration</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            configured 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-semibold block text-sm">
                  {configured ? 'Firebase Live API Connected' : 'Google Auth UI Ready'}
                </span>
                <span className="text-[11px] opacity-80">
                  {configured 
                    ? 'Real Firebase credentials detected from environment.' 
                    : 'UI is completely ready. Use instant Google Sign-In or add credentials.'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span>Environment Configuration (.env)</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-slate-900/60 px-2 py-1 rounded"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Template'}
              </button>
            </h4>
            <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {envSample}
            </pre>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <h4 className="font-semibold text-slate-200 mb-1.5">Where Developer Adds Firebase Config:</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Open <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">src/config/firebaseConfig.ts</code> or the root <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">.env</code>.</li>
              <li>Add your Firebase Web App credentials from the Google Firebase Console.</li>
              <li>Enable "Google" under Firebase Authentication → Sign-in providers.</li>
            </ol>
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 mt-2 text-xs font-medium"
            >
              Open Google Firebase Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {onSimulateGoogleSignIn && (
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/70">
              <h4 className="font-semibold text-white mb-2">Instant Google Auth Simulator</h4>
              <p className="text-slate-400 mb-3 text-[11px]">
                Test instant Google sign-in with your preferred Gmail address right now:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => {
                    onSimulateGoogleSignIn(customEmail, customEmail.split('@')[0]);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Sign In As This Google User
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
