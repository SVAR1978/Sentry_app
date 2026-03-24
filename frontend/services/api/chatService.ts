const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const CHAT_API_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;

class ChatService {
  /**
   * Sends a message to the REST API and returns the response string.
   */
  async sendMessage(message: string): Promise<string> {
    try {
      // Create your payload as required by your custom API structure
      const payload = {
        message: message,
        // userId: "...",
        // sessionId: "...",
      };

      // ⚠️ Use CHAT_API_URL when it is ready.
      // E.g., const url = CHAT_API_URL || `${BACKEND_URL}/api/chat`;
      const url = CHAT_API_URL || "https://your-upcoming-chat-api.com/v1/chat";

      /*
      // Uncomment this when your API is live
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      return data.reply; // <-- Adjust according to your response JSON structure
      */

      // -- REMOVE THE BELOW MOCK WHEN THE ABOVE FETCH IS UNCOMMENTED --
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`API Placeholder Reply: I received "${message}". Note: Update chatService.ts when your API is live!`);
        }, 1500);
      });
      // -------------------------------------------------------------

    } catch (error) {
      console.error("[ChatService] Failed to send message:", error);
      throw error;
    }
  }
}

export default new ChatService();
