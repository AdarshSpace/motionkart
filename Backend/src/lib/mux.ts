import "dotenv/config";
import Mux from "@mux/mux-node";

console.log("Token from mux : ",  process.env.MUX_TOKEN_ID)
console.log("tokenSecret from mux : ", process.env.MUX_SECRET_KEY)

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
});