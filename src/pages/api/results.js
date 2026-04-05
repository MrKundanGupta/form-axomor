export const prerender = false;

// A fixed starting date to calculate elapsed time.
// Set to April 5, 2026 (midnight UTC).
const START_DATE = new Date('2026-04-05T00:00:00Z').getTime();
const START_VOTES = 60094;
const MAX_VOTES = 124387;

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
        const baseHourlyVotes = Math.floor(hoursElapsed) * 618;

        // Additional random votes for the current fractional hour (based on minute)
        const hourSeed = Math.floor(hoursElapsed);
        
        // Random target votes to add by the end of this hour, between 189 and 618
        const maxRandomThisHour = 189 + Math.floor(getSeededRandom(hourSeed) * (618 - 189));
        
        // Progress within the hour (0 to <1)
        const minuteProgress = (minutesElapsed % 60) / 60;
        
        // Add random votes proportional to the minute progress
        const currentMinuteVotes = Math.floor(minuteProgress * maxRandomThisHour);

        let totalGeneratedVotes = START_VOTES + baseHourlyVotes + currentMinuteVotes;

        // Cap the generated votes
        if (totalGeneratedVotes > MAX_VOTES) {
            totalGeneratedVotes = MAX_VOTES;
        }

        // Proportions: Randomized but fixed within a day
        const daySeed = Math.floor(now / (1000 * 60 * 60 * 24));

        let incShare = 0.53 + (getSeededRandom(daySeed) * 0.03);      // 53% to 56%
        let agpShare = 0.39 + (getSeededRandom(daySeed + 1) * 0.06);  // 39% to 45% (matches 'Min 45% Max 42%' request logically)
        let aitcShare = 0.01 + (getSeededRandom(daySeed + 2) * 0.01); // 1% to 2%
        let otherShare = 0.003 + (getSeededRandom(daySeed + 3) * 0.004); // 0.3% to 0.7%

        // Normalize so all shares sum to exactly 1.0 (prevents >100% total due to overlapping ranges)
        const totalShare = incShare + agpShare + aitcShare + otherShare;
        const normIncShare = incShare / totalShare;
        const normAgpShare = agpShare / totalShare;
        const normAitcShare = aitcShare / totalShare;

        const dummyINC = Math.floor(totalGeneratedVotes * normIncShare);
        const dummyAGP = Math.floor(totalGeneratedVotes * normAgpShare);
        const dummyAITC = Math.floor(totalGeneratedVotes * normAitcShare);
        const dummyOther = Math.max(0, totalGeneratedVotes - dummyINC - dummyAGP - dummyAITC); // Whatever is left

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
