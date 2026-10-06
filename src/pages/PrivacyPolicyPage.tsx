import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Database, EyeOff, KeyRound, Globe, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onPrevious,
  onNext
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // When within 60px of the bottom, mark as read/scrolled
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col">
      
      {/* Top Bar with working Back arrow */}
      <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-800">
        <button
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>← Back</span>
        </button>

        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Typing World Policy</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="text-center my-6 space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Please review the Typing World data protection and privacy commitments below.
          Scroll down through the complete terms to access the navigation controls.
        </p>
      </div>

      {/* Scrollable Privacy Policy Content Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 max-h-[58vh] overflow-y-auto pr-3 sm:pr-4 space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-inner"
        tabIndex={0}
        aria-label="Scrollable Privacy Policy Content"
      >
        
        {/* Intro */}
        <section className="space-y-2">
          <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">
            Effective Date: October 2026
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to <strong className="text-white">Typing World</strong>, an interactive typing-learning educational platform designed by Abhi. We prioritize the privacy, digital security, and transparency of all our learners. This Privacy Policy outlines what information is collected, how your data is safeguarded, and how browser-based security protocols protect your learning experience.
          </p>
        </section>

        {/* Section 1: Information Collected */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            1. Information Collected
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            When you register an account or use Typing World, we collect only minimal educational and authentication details necessary to customize your learning journey:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 pl-2">
            <li><strong className="text-slate-200">Account Credentials:</strong> Your Gmail address and an encrypted cryptographic hash of your chosen password.</li>
            <li><strong className="text-slate-200">Account Recovery Data:</strong> Your Date of Birth, Village Name, and Favourite Date. These details are used exclusively for secure password self-service recovery.</li>
            <li><strong className="text-slate-200">Typing Performance Metrics:</strong> Typing velocity (Words Per Minute), accuracy percentages, keystroke timing, completed level milestones, and unlocked badges.</li>
          </ul>
        </section>

        {/* Section 2: Account Information */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            2. Account Information
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your account information remains strictly tied to your authenticated profile. We do not sell, rent, monetize, or trade any student records or personal identifiers to third-party advertising networks or external data brokers.
          </p>
        </section>

        {/* Section 3: Google Sign-In */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            3. Google Sign-In
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Typing World supports verified Google / Gmail authentication via standard OAuth and Firebase Authentication protocols. When signing in with Google, we only receive your public profile identifier (such as your display name, email address, and avatar thumbnail) as authorized by Google's secure consent flow. Typing World never accesses your private emails, Google Drive files, or contacts.
          </p>
        </section>

        {/* Section 4: Password Security */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            4. Password Security
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 font-semibold">Zero Plaintext Policy:</strong> In strict accordance with security best practices, Typing World NEVER stores passwords in plain text format. All user passwords are processed through client-side and server-side cryptographic one-way hashing algorithms (such as salted SHA-256 and PBKDF2). Neither administrators nor system operators can read your actual password.
          </p>
        </section>

        {/* Section 5: Browser Storage */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            5. Browser Storage
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Typing World uses browser-based local storage (HTML5 LocalStorage and SessionStorage) to preserve your current session token, level completion status, and keyboard preferences across device reloads. This guarantees that your unlocked levels and achievements are always preserved when you return to learn.
          </p>
        </section>

        {/* Section 6: User Privacy */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-400" />
            6. User Privacy
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            You maintain full ownership of your typing data. You may request account deletion or clear your local typing cache at any time. We respect child and student privacy laws, including adherence to strict non-intrusive educational tracking practices.
          </p>
        </section>

        {/* Section 7: Data Protection */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            7. Data Protection
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We implement comprehensive technical and organizational measures, including HTTPS encryption in transit, strict Origin isolation, Content Security Policies, and access controls to shield your account against unauthorized alteration, theft, or exposure.
          </p>
        </section>

        {/* Section 8: Changes to this Privacy Policy */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            8. Changes to this Privacy Policy
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We may update our Privacy Policy periodically to reflect new typing features, interactive modules, or regulatory changes. Any modifications will be posted directly on this page with an updated effective date. Continued use of Typing World signifies your acceptance of any revisions.
          </p>
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>You have reached the end of the Typing World Privacy Policy.</span>
          </div>
        </section>

      </div>

      {/* Navigation Controls at the bottom */}
      <div className="pt-6 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onPrevious}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Previous</span>
        </button>

        <div className="text-xs text-slate-500 hidden sm:block">
          {hasScrolledToBottom ? 'Terms reviewed' : 'Scroll down to complete reading'}
        </div>

        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 cursor-pointer"
        >
          <span>Next →</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
