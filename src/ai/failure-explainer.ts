
import OpenAI from 'openai';

export interface FailureDetails {
  testTitle: string;
  errorMessage: string;
  pageUrl?: string;
  pageText?: string;
  apiResponse?: string;
}

export interface FailureExplanation {
  explanation: string;
  likelyCause: string;
  suggestedFix: string;
}

export async function explainFailure(
  details: FailureDetails,
): Promise<FailureExplanation> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is missing. Configure it in your local .env file.',
    );
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    instructions: [
      'You are a senior SDET helping diagnose automated test failures.',
      'Use only the supplied evidence.',
      'Distinguish facts from hypotheses.',
      'Do not claim certainty when the evidence is insufficient.',
      'Never request passwords, API keys, cookies, or access tokens.',
      'Return concise plain text with these headings:',
      'Explanation:',
      'Likely cause:',
      'Suggested fix:',
    ].join('\n'),
    input: JSON.stringify(details),
    max_output_tokens: 400,
  });

  const text = response.output_text.trim();

  if (!text) {
    throw new Error('The LLM returned an empty failure explanation.');
  }

  return {
    explanation: text,
    likelyCause: 'See the LLM explanation for the evidence-based assessment.',
    suggestedFix: 'See the LLM explanation for the proposed next step.',
  };
}
