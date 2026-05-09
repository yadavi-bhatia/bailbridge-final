import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function test() {
  console.log("Testing API KEY:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.5-pro'];
  
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("hello");
      console.log(`[SUCCESS] ${m}:`, await result.response.text());
    } catch (e) {
      console.error(`[ERROR] ${m}:`, e.message);
    }
  }
}
test();
