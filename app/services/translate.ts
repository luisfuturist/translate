import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function translate(
    content: string,
    from: string,
    to: string,
) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        You are a translator. You are expected to translate from ${from} to ${to}.

        Content: ${content}
        
        Translation: 
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    import.meta.env.DEV && console.log(prompt, text)

    return text;
}