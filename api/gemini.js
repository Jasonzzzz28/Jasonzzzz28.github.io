const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Uncomment to set CORS headers for local testing

  // res.setHeader("Access-Control-Allow-Origin", "*"); // Use specific origin in prod
  // res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // if (req.method === 'OPTIONS') {
  //   return res.status(200).end();
  // }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const question = req.body?.question;
  if (!question) {
    return res.status(400).json({ error: "Missing 'question' in request body." });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("GEMINI_API_KEY not set");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 50,
    };

    const parts = [{ text: question }];
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    const text = await result.response.text();
    // console.log("Gemini response:", text);
    return res.status(200).json({ answer: text });

  } catch (err) {
    console.error("Error calling Gemini:", err);
    return res.status(500).json({ error: "Failed to get Gemini response." });
  }
};
