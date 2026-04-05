import React, { useState } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import CandidateCard from './CandidateCard';

export default function VotingForm() {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Authentic Candidate Data with Wikimedia Official Logos & Placeholder Photos
    const basePath = import.meta.env.BASE_URL;

    const candidates = [
        {
            id: 'inc',
            party: 'Indian National Congress',
            partyLocal: 'ভাৰতীয় জাতীয় কংগ্ৰেছ',
            symbolUrl: basePath + '/inc.svg.png'
        },
        {
            id: 'agp',
            party: 'Asom Gana Parishad',
            partyLocal: 'অসম গণ পৰিষদ',
            symbolUrl: basePath + '/agp.png'
        },
        {
            id: 'aitc',
            party: 'All India Trinamool Congress',
            partyLocal: 'অল ইণ্ডিয়া তৃণমূল কংগ্ৰেছ',
            symbolUrl: basePath + '/aitc.jpg'
        },
        {
            id: 'other',
            party: 'Others',
            partyLocal: 'অন্যান্য',
            symbolUrl: basePath + '/other.svg'
        }
    ];

    const handleSelectCandidate = (candidate) => {
        if (isSubmitting) return;

        setSelectedCandidate(candidate);
        setIsSubmitting(true);
        setError('');

        const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        
        // Brief timeout so the user sees the radio button get selected before redirecting
        setTimeout(() => {
            window.location.href = normalizedBase + '/results';
        }, 150);
    };

    return (
        <div className="max-w-5xl mx-auto px-2 md:px-4 py-6">

            {/* Important Notice Board */}
            <div className="mb-6 bg-[#fff3cd] border border-[#ffeeba] rounded-md p-3 md:p-4 text-xs md:text-sm text-[#856404] shadow-sm flex items-start">
                <AlertTriangle className="mr-2 md:mr-3 flex-shrink-0 mt-0.5" size={18} />
                <div>
                    <strong className="block mb-1">IMPORTANT INSTRUCTIONS / গুৰুত্বপূৰ্ণ নিৰ্দেশনা:</strong>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1">
                        <li>This is an independent public opinion survey.</li>
                        <li>Your participation is anonymous and strictly confidential.</li>
                        <li>Select your preferred party to submit your opinion immediately.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 md:px-6 py-3 flex items-center">
                    <FileText className="text-[#003366] mr-2" size={20} />
                    <h3 className="text-md md:text-lg font-bold text-[#003366]">E-Ballot / ই-বেলেট</h3>
                </div>

                <div className="p-2 md:p-4 bg-gray-50 relative">
                    {/* Optional overlay while submitting for UX */}
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                            <span className="font-bold text-[#003366] animate-pulse">Processing...</span>
                        </div>
                    )}
                    <CandidateCard
                        candidates={candidates}
                        selectedCandidate={selectedCandidate}
                        setSelectedCandidate={handleSelectCandidate}
                    />
                </div>
                
                {error && (
                    <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-red-600 text-xs font-semibold text-center">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
