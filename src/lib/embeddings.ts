import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small';

export async function getEmbedding(text: string) {
  try {
    // OpenAI API recommends replacing newlines with spaces for better performance.
    const sanitizedText = text.replace(/\n/g, ' ');

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: sanitizedText,
    });

    if (response.data.length === 0 || !response.data[0].embedding) {
      throw new Error('Failed to generate embedding.');
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw new Error('Failed to generate embedding from OpenAI API.');
  }
}

export async function getEmbeddings(texts: string[]) {
  try {
    const sanitizedTexts = texts.map(text => text.replace(/\n/g, ' '));

    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: sanitizedTexts,
      });

    if (response.data.length !== texts.length) {
        throw new Error('Number of embeddings does not match number of texts.');
    }

    return response.data.map(d => d.embedding);

  } catch (error) {
    console.error('Error getting embeddings:', error);
    throw new Error('Failed to generate embeddings from OpenAI API.');
  }
}
