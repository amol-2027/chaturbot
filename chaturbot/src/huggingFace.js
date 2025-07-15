import { prevUser } from "./context/UserContext";

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

export async function query(data) {
  if (!HF_API_KEY) {
    throw new Error(
      "Hugging Face API key is not set. Please define VITE_HF_API_KEY in your .env file."
    );
  }
  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}
