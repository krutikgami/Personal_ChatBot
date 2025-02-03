import { useState } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    const userMessage = { sender: "User", message: userInput };
    const newChatHistory = [...currentChat, userMessage];

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMessage = { sender: "AI", message: formatResponse(data.response) };
        newChatHistory.push(botMessage);
      } else {
        const botErrorMessage = { sender: "AI", message: "Error: " + data.message };
        newChatHistory.push(botErrorMessage);
      }
    } catch (error) {
      const botErrorMessage = { sender: "AI", message: "Error: Unable to fetch response." };
      newChatHistory.push(botErrorMessage);
    }

    setCurrentChat(newChatHistory);
    setChatHistory([...chatHistory, newChatHistory]);
    setUserInput("");
    setLoading(false);
  };

  const formatResponse = (text) => {
    return text
      .replace(/(Possible Explanations:|Recommended Actions:|Treatment Options \(Post-Diagnosis\):)/g, "<b>$1</b>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  const handleNewChat = () => {
    if (currentChat.length > 0) {
      setChatHistory([...chatHistory, currentChat]);
    }
    setCurrentChat([]);
    setUserInput("");
  };

  const handleChatClick = (index) => {
    setCurrentChat(chatHistory[index]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/5 bg-indigo-600 text-white p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-4">🤖 AI ChatBot</h1>

        <button
          onClick={handleNewChat}
          className="mb-6 px-4 py-2 bg-indigo-500 hover:bg-indigo-700 rounded-lg self-center"
        >
          New Chat
        </button>

        <div className="flex-1 w-full space-y-2 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Previous Chats:</h2>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              onClick={() => handleChatClick(index)}
              className="p-3 bg-indigo-700 hover:bg-indigo-500 rounded-lg cursor-pointer text-white"
            >
              {chat[0]?.message || "Chat " + (index + 1)}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 flex flex-col bg-white shadow-lg rounded-l-3xl">
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-4">
            {currentChat.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.sender === "User"
                    ? "bg-indigo-100 self-end text-right w-1/3"
                    : "bg-gray-100 self-start text-left w-1/3"
                }`}
              >
                <p className="font-semibold">{msg.sender}:</p>
                <div
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                  className="text-gray-800"
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-center items-center mt-4">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
