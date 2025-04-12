import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { mealName } = await req.json();

  if (!mealName) {
    return NextResponse.json({ error: 'Meal name is required' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `List the ingredients needed to make ${mealName}. Only list ingredients, no intro or instructions. Only use lowercase, no plural words, and list only whole ingredients, nothing such as 'marinara sauce.' Name items as they would be sold in a farmer's market. Use commas, not newlines. Do not list unnecessary adjectives in front of items, such as 'free-range'. `
    );

    const response = result.response;
    const text = response.text();

    console.log('Gemini SDK response:', text);

    return NextResponse.json({ ingredients: text });

  } catch (err) {
    console.error('Gemini SDK error:', err);
    return NextResponse.json({ error: 'Gemini SDK call failed.' }, { status: 500 });
  }
}
