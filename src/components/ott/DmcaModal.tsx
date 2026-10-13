import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Title } from '../../types/ott';

interface DmcaModalProps {
  title?: Title | null;
  onClose: () => void;
}

export const DmcaModal: React.FC<DmcaModalProps> = ({ title, onClose }) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [infringingUrl, setInfringingUrl] = useState(
    title ? `https://moviemart.io/title/${title.slug}` : 'https://moviemart.io'
  );
  const [originalWorkDescription, setOriginalWorkDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/copyright-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimantName,
          claimantEmail,
          infringingUrl,
          originalWorkDescription,
          titleId: title?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportId(data.reportId);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#1b1b1b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#E50914] border border-red-600/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">DMCA Copyright Infringement Notice</h2>
              <p className="text-xs text-gray-400">Formal takedown reporting for verified rightsholders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Report Successfully Logged</h3>
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                Your report has been queued for immediate review. Takedown reference:
              </p>
              <div className="font-mono text-xs text-amber-400 bg-neutral-900 py-1.5 px-3 rounded-lg border border-white/10 inline-block font-bold">
                {reportId}
              </div>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Rightsholder / Representative Name</label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Universal Copyright Agent"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Official Contact Email</label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="legal@rights-holder.com"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Infringing URL on MovieMart</label>
                <input
                  type="url"
                  required
                  value={infringingUrl}
                  onChange={(e) => setInfringingUrl(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Original Work Description & Authorization Details</label>
                <textarea
                  required
                  rows={3}
                  value={originalWorkDescription}
                  onChange={(e) => setOriginalWorkDescription(e.target.value)}
                  placeholder="Identify the copyrighted work and explain why this source lacks authorization..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="text-[10px] text-gray-500 leading-relaxed">
                By submitting, you certify under penalty of perjury that you are authorized to act on behalf of the copyright owner.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit DMCA Notice</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
