import { useState, useRef, useEffect } from "react";
import { RiRobotLine, RiCloseLine, RiSendPlane2Line } from "react-icons/ri";
import API from "../api/axios";

const AIChatBot = ({ isOpen, onClose, isMinimized, onOpen }) => {
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Echo, your social media guide. How can I help you today?",
    },
  ]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !isMinimized &&
        chatRef.current &&
        !chatRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMinimized, onClose]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // 1. Update UI with User Message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // 2. Map history to match the Backend/Gemini 2026 structure
      // We send the current state of messages (before the newest one is added to context)
      const history = messages.map(({ role, content }) => ({
        role: role === "assistant" ? "model" : "user",
        parts: [{ text: String(content) }],
      }));

      // 3. API Call to Backend
      const res = await API.post("/api/v1/ai/chat", {
        message: userMessage,
        history,
      });

      // 4. Update UI with Echo's response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (error) {
      console.error("❌ Echo AI Error:", error.response?.data || error.message);

      const errorMessage = error.response?.data?.error?.includes("Quota")
        ? "I'm a bit overwhelmed right now. Please wait a minute before asking again!"
        : "Sorry, I lost my connection. Could you try that again?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-600 transition z-50 animate-in fade-in zoom-in duration-300"
      >
        <RiRobotLine size={20} />
        <span className="text-sm font-medium">Chat with Echo</span>
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[500px] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500 rounded-lg shrink-0">
            <RiRobotLine className="text-white" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50 leading-none">
              Echo AI
            </span>
            <span className="text-[10px] text-green-500 font-medium mt-1 uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-1.5 text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <RiSendPlane2Line size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-zinc-400 mt-2">
          Echo can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AIChatBot;
