import { useState, useRef, useEffect } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
} from "react-icons/fa";

const BOX_WIDTH = 360;
const BOX_HEIGHT = 520;

/* 🧠 HEALTHCARE FILTER */
const isHealthcareQuestion = (text) => {
  const keywords = [
    "doctor",
    "medicine",
    "tablet",
    "fever",
    "pain",
    "headache",
    "symptom",
    "treatment",
    "hospital",
    "appointment",
    "blood",
    "bp",
    "sugar",
    "diabetes",
    "covid",
    "infection",
    "health",
  ];

  return keywords.some((word) =>
    text.toLowerCase().includes(word)
  );
};

/* ⏰ TIME FORMAT */
const formatTime = (time) =>
  new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const HealthcareChatbot = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  /* 👤 USER STORAGE */
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const STORAGE_KEY = user?.id
    ? `chat_messages_${user.id}`
    : "chat_messages_guest";

  /* 💬 CHAT */
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            role: "bot",
            text: "Hello 👋 How can I help you?",
            time: new Date().toISOString(),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  /* 🔽 AUTO SCROLL */
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* 📍 INITIAL POSITION */
  useEffect(() => {
    setPosition({
      x: window.innerWidth - BOX_WIDTH - 56,
      y: window.innerHeight - BOX_HEIGHT - 56,
    });
  }, []);

  /* 🖱️ DRAG */
  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: Math.max(
        0,
        Math.min(e.clientX - offset.current.x, window.innerWidth - BOX_WIDTH)
      ),
      y: Math.max(
        0,
        Math.min(e.clientY - offset.current.y, window.innerHeight - BOX_HEIGHT)
      ),
    });
  };

  const onMouseUp = () => (dragging.current = false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  /* 🧹 CLEAR CHAT */
  const clearChat = () => {
    if (!window.confirm("Clear entire chat?")) return;

    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: Date.now(),
        role: "bot",
        text: "Hello 👋 How can I help you?",
        time: new Date().toISOString(),
      },
    ]);
  };

  /* 🔥 STREAMING BOT REPLY */
  const streamBotReply = (fullText) => {
    let index = 0;
    setIsTyping(true);

    const botMsg = {
      id: Date.now(),
      role: "bot",
      text: "",
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botMsg]);

    const interval = setInterval(() => {
      index++;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsg.id
            ? { ...m, text: fullText.slice(0, index) }
            : m
        )
      );

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
  };

  /* 💬 SEND MESSAGE (HEALTHCARE ONLY) */
  const sendMessage = () => {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: question,
        time: new Date().toISOString(),
      },
    ]);

    setInput("");

    // ❌ Not healthcare
    if (!isHealthcareQuestion(question)) {
      streamBotReply(
        "🙏 I can help only with healthcare-related questions like symptoms, medicines, doctors, or appointments."
      );
      return;
    }

    // ✅ Healthcare
    streamBotReply(
      "🩺 I am fetching reliable medical information for you. Please wait a moment..."
    );
  };

  /* 🎤 VOICE INPUT */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  /* 💾 SAVE CHAT */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, STORAGE_KEY]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-[#2277f7] text-white p-4 rounded-full shadow-xl z-50 cursor-pointer"
        >
          <FaComments size={22} />
        </button>
      )}

      {open && (
        <div
          style={{ left: position.x, top: position.y }}
          className="fixed w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div
            onMouseDown={onMouseDown}
            className="bg-emerald-500 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center cursor-move"
          >
            <p className="text-sm font-semibold">Healthcare Assistant</p>

            <div className="flex items-center gap-3 cursor-pointer">
              <p
                onClick={clearChat}
                className="cursor-pointer border px-2 text-xs"
              >
                Clear
              </p>
              <FaTimes onClick={() => setOpen(false)} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-2 space-y-3 overflow-y-auto text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] ${
                  msg.role === "user" ? "ml-auto text-right" : "text-left"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg inline-block max-w-[80%] whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-emerald-100"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {formatTime(msg.time)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs italic text-gray-400">
                Bot is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type or speak..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />

            <button
              onClick={startListening}
              className={`p-2 rounded-lg ${
                isListening ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              <FaMicrophone />
            </button>

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-emerald-500 text-white p-2 rounded-lg disabled:opacity-50"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );o
};

export default HealthcareChatbot;
