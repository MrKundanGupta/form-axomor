export const prerender = false;

// A fixed starting date to calculate elapsed time.
// Set to April 9, 2026 (midnight UTC).
const START_DATE = new Date('2026-04-09T00:00:00Z').getTime();
const START_VOTES = 159387;
const MAX_VOTES = 164387;

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

        // Base votes added for full hours (+204 per hour)
        const baseHourlyVotes = Math.floor(hoursElapsed) * 204;

        // Additional random votes for the current fractional hour (based on minute)
        const hourSeed = Math.floor(hoursElapsed);

        // Random target votes to add by the end of this hour, between 50 and 204
        const maxRandomThisHour = 50 + Math.floor(getSeededRandom(hourSeed) * (204 - 50));

        // Progress within the hour (0 to <1)
        const minuteProgress = (minutesElapsed % 60) / 60;

        // Add random votes proportional to the minute progress
        const currentMinuteVotes = Math.floor(minuteProgress * maxRandomThisHour);

        let totalGeneratedVotes = START_VOTES + baseHourlyVotes + currentMinuteVotes;

        // Cap the generated votes
        if (totalGeneratedVotes > MAX_VOTES) {
            totalGeneratedVotes = MAX_VOTES;
        }

        // Party vote shares: absolute ranges, randomized but fixed within a day
        const daySeed = Math.floor(now / (1000 * 60 * 60 * 24));

        const dummyINC = 90840 + Math.floor(getSeededRandom(daySeed) * (96000 - 90840));
        const dummyAITC = 1371 + Math.floor(getSeededRandom(daySeed + 2) * (1529 - 1371));
        const dummyOther = 2219 + Math.floor(getSeededRandom(daySeed + 3) * (2519 - 2219));
        const dummyAGP = Math.max(0, totalGeneratedVotes - dummyINC - dummyAITC - dummyOther);

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
