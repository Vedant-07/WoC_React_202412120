import { useState } from "react";
import Draggable from "react-draggable";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatBotMessage, setChatBotMessage] = useState("");
  const [chatBotResponse, setChatBotResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    setLoading(true);
    if (!chatBotMessage.trim()) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
      import.meta.env.VITE_GEMINI_API_KEY
    }`;

    const requestBody = {
      contents: [{ parts: [{ text: chatBotMessage }] }],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP Error ${response.status}: ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();

      const generatedText =
        result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setChatBotResponse(generatedText);
      setChatBotMessage("");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setChatBotResponse("Error getting response from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none z-50">
      <Draggable bounds="parent" handle=".drag-handle">
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              💬
            </button>
          ) : (
            // Expanding Chat Window
            <div className="w-80 h-96 bg-white shadow-xl rounded-xl p-4 flex flex-col transition-all duration-300">
              <div className="flex justify-between items-center border-b pb-2 cursor-move drag-handle">
                <h2 className="text-lg font-semibold">AI Support</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ❌
                </button>
              </div>

              <div className="flex-1 overflow-auto p-2">
                {loading ? (
                  <p>Loading...........</p>
                ) : chatBotResponse.length > 0 ? (
                  <p>{chatBotResponse}</p>
                ) : (
                  <p className="text-gray-600 text-sm">How can I help you?</p>
                )}
              </div>

              <div className="flex border-t pt-2 items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chatBotMessage}
                  onChange={(e) => setChatBotMessage(e.target.value)}
                  disabled={loading}
                />

                {/* Send Button (Fixed width, aligned right) */}
                <button
                  className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                  onClick={handleSendMessage}
                  disabled={loading}
                >
                  ▶️
                </button>
              </div>
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default Chatbot;
