import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";


export interface ChatMessage {
  role: "student" | "assistant";
  content: string;
}

interface RetrieveInput {
  courseId: string;

  reQuestion: string;

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



// ─── Main Retriever ───────────────────────────────────────────────────

export async function retrieveAnswer(input: RetrieveInput): Promise<RetrieveResponse>  {
  try{
    const { courseId, reQuestion, moduleId, videoId } = input;

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
    reQuestion,
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
  

  const prompt = `You are a friendly educational assistant helping students learn from course materials.

      Context (extracted from course documents):
      ${context}
      
      Question:
      ${reQuestion}
      
      Rules:
      - If the question is a greeting (e.g. "hi", "hello", "how are you"), respond warmly and briefly,
        then invite the student to ask about the course material.
      - If the question is a general conversational message (e.g. "thanks", "okay", "got it"),
        respond naturally and briefly.
      - If the answer IS present in the context, answer precisely and factually from it.
      - If the answer is NOT present in the context, say:
        "I don't know based on the uploaded document(s)."
      - Never make up information beyond what's in the context for course-related questions.
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

// ───  Query Rewriter ───────────────────────────────────────────────────
export async function rewriteQuestion( chatHistory: ChatMessage[], rawQuestion: string ): Promise<string> {

  // If no history, nothing to resolve — return as-is
  if (chatHistory.length === 0) return rawQuestion;

  const formattedHistory = chatHistory
    .map((m) => `${m.role === "student" ? "Student" : "Assistant"}: ${m.content}`)
    .join("\n");

  const rewriterPrompt = `You are a query rewriter for an educational assistant.

     Below is a conversation between a student and an assistant, followed by the student's latest question.
     Your job is to rewrite the latest question into a SINGLE, fully self-contained question that can be 
     understood without any prior context.
     
     Rules:
     - Resolve pronouns like "it", "that", "this", "those" using the conversation history
     - Resolve follow-ups like "explain more", "give another example of that" into explicit questions
     - If the question is already self-contained, return it unchanged
     - Return ONLY the rewritten question — no explanation, no preamble
     
     Conversation History:
     ${formattedHistory}
     
     Student's Latest Question:
     ${rawQuestion}
     
     Rewritten Question:`;

    // LLM
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      apiKey: process.env.GOOGLE_API_KEY as string,
    });

  const response = await llm.invoke(rewriterPrompt);
  const rewritten = String(response.content).trim();

  console.log(`[QueryRewriter] "${rawQuestion}" → "${rewritten}"`);
  return rewritten;
}


