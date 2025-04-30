export default async function handler(req, res) {
  const { prompt } = req.body;

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

  res.status(200).json({ code });
}
