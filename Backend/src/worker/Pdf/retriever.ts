import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

interface RetrieveInput {
  courseId: string;

  question: string;

  moduleId?: string;
  videoId?: string;
}

interface RetrieveResponse {
  answer?: string;

  sources: {
    courseId: string;

    moduleId: string;
    moduleTitle?: string;

    videoId: string;
    videoTitle?: string;

    fileName: string;

    chunkIndex: number;
  }[];
}


export async function retrieveAnswer(input: RetrieveInput): Promise<RetrieveResponse>  {
  try{
    const { courseId, question, moduleId, videoId } = input;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY");
  }

  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    throw new Error("Missing Pinecone configuration");
  }

  // 1️⃣ Embeddings (same model used during ingestion)
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // 2️⃣ Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.index(
    process.env.PINECONE_INDEX_NAME
  );

  // 3️⃣ Vector Store (existing index)
  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace: courseId,  // 🔐 course isolation
    }
  );

  // 4️⃣ Similarity search
  const results = await vectorStore.similaritySearch(
    question,
    5,
    courseId
      ? { courseId: { $eq: courseId } }  // ✅ correct format
      : undefined
  );


  if (results.length === 0) {
    return {
      answer: "I don’t know based on the uploaded document(s).",
      sources: [],
    };
  }

  const context = results
    .map((doc) => doc.pageContent)
    .join("\n\n");

  // 5️⃣ LLM
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  

  const prompt = `You are an assistant answering questions strictly from the given context.

Context:
${context}

Question:
${question}

Rules:
- If the answer is not present in the context, say:
  "I don’t know based on the document."
- Be precise and factual.
`;

  const response = await llm.invoke(prompt);

  console.log("response :", response.content);

    return {
      answer: String(response.content),

      sources: results.map((doc) => ({
        courseId: doc.metadata.courseId,

        moduleId: doc.metadata.moduleId,
        moduleTitle: doc.metadata.moduleTitle,

        videoId: doc.metadata.videoId,
        videoTitle: doc.metadata.videoTitle,

        fileName: doc.metadata.fileName,

        chunkIndex: doc.metadata.chunkIndex,
      })),
    };
  }
  catch(error){
     console.log('Retriever show Error : ', error);
     throw error
  }
}