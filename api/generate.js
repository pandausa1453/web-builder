export default async function handler(req, res) {
  try {
    const body = req.method === "POST" ? await req.json() : null;
    const prompt = body?.prompt;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful AI that writes HTML/CSS/JS websites in one file." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const json = await openaiRes.json();
    const code = json.choices?.[0]?.message?.content || '';

    return res.status(200).json({ code });
  } catch (err) {
    return res.status(500).json({ error: 'Function crashed', details: err.message });
  }
}
