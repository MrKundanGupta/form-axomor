import React from 'react';

export default function CandidateCard({ candidates, selectedCandidate, setSelectedCandidate }) {
  return (
    <div className="flex flex-col gap-3">
      {candidates.map((candidate) => (
        <label
          key={candidate.id}
          className={`flex flex-row items-center justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-all shadow-sm
            ${selectedCandidate?.id === candidate.id
              ? 'bg-[#eef2fb] border-[#003366] ring-2 ring-[#003366]'
              : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
        >
          {/* Left Column: Radio + Details */}
          <div className="flex items-center gap-3 w-2/3 pr-2">

            {/* Radio Button */}
            <div className="shrink-0 flex items-center justify-center">
              <input
                type="radio"
                name="candidate"
                checked={selectedCandidate?.id === candidate.id}
                onChange={() => setSelectedCandidate(candidate)}
                className="w-5 h-5 md:w-6 md:h-6 text-[#003366] focus:ring-[#003366] border-gray-400 cursor-pointer"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg md:text-xl text-gray-900 leading-tight truncate">{candidate.party}</p>
              <p className="font-bold text-md md:text-lg text-gray-700 mt-1 truncate">{candidate.partyLocal}</p>
            </div>

          </div>

          {/* Right Column: Symbol */}
          <div className="w-1/3 flex justify-end pl-3 border-l border-gray-200">
            <div className="w-20 h-20 md:w-24 md:h-24 p-2 border border-gray-300 bg-white shadow-sm flex items-center justify-center rounded-md shrink-0">
              <img src={candidate.symbolUrl} alt={candidate.party} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

        </label>
      ))}
    </div>
  );
}
