import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { mealName } = await req.json();

  if (!mealName) {
    return NextResponse.json(
      { error: "Meal name is required" },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `List the ingredients needed to make ${mealName}.
       If the meal name appears to be a single ingredient itself (e.g., "tomato"), return just that ingredient.
    
       Follow these formatting rules:
       - Use only lowercase
       - Use singular forms (e.g., "carrot" not "carrots")
       - Only list raw, whole ingredients (e.g., "tomato" not "marinara sauce")
       - Reduce processed or derived ingredients to their base whole form (e.g., "breadcrumb" → "bread")
       - Use base item names only (e.g., "chicken" instead of "chicken breast")
       - Avoid brand names or compound items (e.g., no "hot sauce" or "soy milk")
       - Name items as they'd be sold at a farmers market
       - Avoid toppings, garnishes, or sides unless central to the dish
       - Avoid descriptive adjectives (e.g., no "fresh", "free-range")
       - Separate items using **commas only**, no newlines or bullet points
    
       Be thorough. If needed, search multiple recipe variations to infer a complete ingredient list.
       Return only the final list.`
    );
    

    const response = result.response;
    const text = response.text();

    console.log("Gemini SDK response:", text);

    return NextResponse.json({ ingredients: text });
  } catch (err) {
    console.error("Gemini SDK error:", err);
    return NextResponse.json(
      { error: "Gemini SDK call failed." },
      { status: 500 }
    );
  }
}
