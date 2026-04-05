export const prerender = false;

export const POST = async (context) => {
    return new Response(JSON.stringify({ success: true, message: "Vote logic bypassed. No data collected." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
