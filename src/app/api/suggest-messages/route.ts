
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. 
    Each question should be separated by '||'. These questions are for an anonymous social messaging platform, 
    like Qooh.me, and should be suitable for a diverse audience. 
    Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct", // or "openai/gpt-3.5-turbo"
                messages: [
                    { role: "user", content: prompt }
                ]
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify(errorData), { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content || 'No result';

        return new Response(JSON.stringify({ result: generatedText }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Something went wrong', details: error }), {
            status: 500,
        });
    }
}
