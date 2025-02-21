
import React, { useState, useEffect } from "react";
import { ChatBox } from "../../Constants/apiRoutes"; // Import API route
import { GrSend } from "react-icons/gr";
import { FaUserAlt, FaRobot } from "react-icons/fa"; // Import user and AI icons

const AIChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch(ChatBox, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      if (!response.ok) throw new Error("Failed to fetch AI response");
      const data = await response.json();

      const aiMessage = {
        text: data?.reply || "No valid response received from AI.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll chatbox when messages update
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  // Retrieve the navbar-collapsed value from localStorage
  const storedCollapsed = localStorage.getItem('navbar-collapsed') === 'true';
 
  // Set the initial state based on the stored value
  const [isExpanded, setIsExpanded] = useState(!storedCollapsed);
 
 
  useEffect(() => {
    // Set the initial state based on the localStorage value
    const storedCollapsed = localStorage.getItem('navbar-collapsed');
    if (storedCollapsed !== null) {
      setIsExpanded(storedCollapsed === 'false');
    }
  }, []); // Only run this once on component mount

  return (
   
    <div
  className={`main-container ${isExpanded ? 'expanded' : 'collapsed'} flex flex-col h-screen`}
>
  {/* Header */}
  <div className="flex justify-between items-center p-4 border-b">
    <h2 className="text-lg font-bold">AI Chat Assistant</h2>
  </div>

  {/* Messages */}
  <div
    id="chat-box"
    className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50"
  >
    <div className="flex justify-start">
      <div className="max-w-xs p-3 rounded-lg bg-gray-200 text-gray-900">
        Welcome to Imly!
      </div>
    </div>
    <div className="flex justify-start">
      <div className="max-w-xs p-3 rounded-lg bg-gray-200 text-gray-900">
        What are you looking for?
      </div>
    </div>

  
{messages.map((message, index) => (
  <div
    key={index}
    className={`flex ${
      message.sender === "user" ? "justify-end" : "justify-start"
    } space-x-2`}
  >
    {/* User or AI Icon */}
    <div className="flex items-center">
      {message.sender === "user" ? (
        <FaUserAlt className="text-custom-darkblue w-6 h-6" />
      ) : (
        <FaRobot className="text-custom-darkblue w-6 h-6" />
      )}
    </div>

    {/* Message */}
    <div
      className={`max-w-xs p-3 rounded-lg ${
        message.sender === "user"
          ? "bg-custom-darkblue text-white"
          : "bg-gray-200 text-gray-900"
      } whitespace-pre-line`}
    >
      {message.text}
    </div>
  </div>
))}

  </div>

  {/* Input - Fixed to bottom */}
  <div className="flex items-center p-4 border-t bg-white sticky bottom-0">
    <textarea
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder="Type your question here..."
      rows="1"
      className="flex-1 p-2 border rounded-lg resize-none"
    />
    <button
      onClick={handleSubmit}
      disabled={loading || !userInput.trim()}
      className="ml-2 bg-custom-darkblue text-white p-2 rounded-lg disabled:opacity-50"
    >
      {loading ? "..." : <GrSend />}
    </button>
  </div>
</div>

  );
};

export default AIChatBot;
