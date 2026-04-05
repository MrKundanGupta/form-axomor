export const prerender = false;

// A fixed starting date to calculate elapsed time.
// Set to March 1, 2026.
const START_DATE = new Date('2026-04-01T00:00:00Z').getTime();
const START_VOTES = 70094;
const MAX_VOTES = 154387;

// Function to seeded random based on elapsed time to keep numbers consistent per min
function getSeededRandom(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

export const GET = async (context) => {
    try {
        const now = Date.now();

        // Minutes elapsed since start date
        const minutesElapsed = Math.max(0, (now - START_DATE) / (1000 * 60));
        const hoursElapsed = minutesElapsed / 60;

        // Base votes added for full hours
        const baseHourlyVotes = Math.floor(hoursElapsed) * 450;

        // Additional random votes for the current fractional hour (based on minute)
        const currentMinuteSeed = Math.floor(minutesElapsed);
        const minuteRandomFactor = getSeededRandom(currentMinuteSeed) * 0.5 + 0.5;
        const currentMinuteVotes = Math.floor((minutesElapsed % 60) * 7.5 * minuteRandomFactor);

        let totalGeneratedVotes = START_VOTES + baseHourlyVotes + currentMinuteVotes;

        // Cap the generated votes
        if (totalGeneratedVotes > MAX_VOTES) {
            totalGeneratedVotes = MAX_VOTES;
        }

        // Proportions: 55%-60% INC, 38%-44% AGP, 1%-2% AITC, 0.2%-0.4% Others
        // All shares are defined independently then normalized so they always sum to 100%
        const daySeed = Math.floor(now / (1000 * 60 * 60 * 24));

        const incShare = 0.55 + (getSeededRandom(daySeed) * 0.05);
        const agpShare = 0.38 + (getSeededRandom(daySeed + 1) * 0.06);
        const aitcShare = 0.01 + (getSeededRandom(daySeed + 2) * 0.01);
        const otherShare = 0.002 + (getSeededRandom(daySeed + 3) * 0.002);

        // Normalize so all shares sum to exactly 1.0
        const totalShare = incShare + agpShare + aitcShare + otherShare;
        const normIncShare = incShare / totalShare;
        const normAgpShare = agpShare / totalShare;
        const normAitcShare = aitcShare / totalShare;
        const normOtherShare = otherShare / totalShare;

        const dummyINC = Math.floor(totalGeneratedVotes * normIncShare);
        const dummyAGP = Math.floor(totalGeneratedVotes * normAgpShare);
        const dummyAITC = Math.floor(totalGeneratedVotes * normAitcShare);
        const dummyOther = totalGeneratedVotes - dummyINC - dummyAGP - dummyAITC;

        const finalResults = [
            { id: 'inc', name: 'INC', votes: dummyINC, color: '#0055A4' },
            { id: 'agp', name: 'AGP', votes: dummyAGP, color: '#228B22' },
            { id: 'aitc', name: 'AITC', votes: dummyAITC, color: '#20B2AA' },
            { id: 'other', name: 'Others', votes: dummyOther, color: '#808080' }
        ];

        return new Response(JSON.stringify(finalResults), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error("API Results Crash:", e);
        return new Response(JSON.stringify([]), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
