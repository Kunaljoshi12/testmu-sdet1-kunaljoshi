
require("dotenv").config();

const OpenAI = require("openai");

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing from .env");
    process.exitCode = 1;
    return;
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input:
        "You are validating an SDET assessment API connection. Reply with: API connection successful.",
      max_output_tokens: 50,
    });

    console.log("API request successful.");
    console.log("Model:", response.model);
    console.log("LLM response:", response.output_text);
  } catch (error) {
    console.error("API request failed.");

    if (error.status) {
      console.error("HTTP status:", error.status);
    }

    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}

main();
