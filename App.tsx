import React, { useState, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isLink?: boolean; // Added isLink property to handle clickable links
}

// Define Custom SpeechRecognitionEvent Type
interface CustomSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Detect Speech Recognition API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function SimpleChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<InstanceType<
    typeof SpeechRecognition
  > | null>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event: Event) => {
        console.error("Speech recognition error:", (event as any).error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    } else {
      console.warn("Speech Recognition is not supported in this browser.");
    }
  }, []);

  const handleSend = async (message?: string) => {
    const text = message || inputValue;
    if (!text.trim()) return;

    const newMessage: Message = { id: Date.now(), text, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      const response = await fetch("http://localhost:5000/find_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const responses = data.response.split("\n");

      // Extract first line (URL)
      const firstLine = responses[0] || "";
      const isValidUrl = firstLine.startsWith("http");

      const aiMessages: Message[] = responses.map(
        (line: string, index: number) => ({
          id: Date.now() + index,
          text: line || "No response received.",
          isUser: false,
          isLink: index === 0 && isValidUrl, // First message is a clickable link if valid
        })
      );

      console.log(text);
      setMessages((prev) => [...prev, ...aiMessages]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: "Error fetching response.", isUser: false },
      ]);
    }
  };

  const handleListen = () => {
    if (!speechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      speechRecognition.stop();
    } else {
      speechRecognition.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Product Finder</h1>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ textAlign: msg.isUser ? "right" : "left" }}
          >
            {msg.isLink ? (
              // Render clickable link if it's a URL
              <a
                href={msg.text}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  background: "#28a745",
                  color: "#fff",
                  textDecoration: "underline",
                  display: "block",
                  marginBottom: "5px",
                  textAlign: "center",
                }}
              >
                Click here to view product
              </a>
            ) : (
              <span
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  background: msg.isUser ? "#007bff" : "#ddd",
                  color: msg.isUser ? "#fff" : "#000",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                {msg.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "65%", padding: "10px", borderRadius: "5px" }}
      />
      <button
        onClick={() => handleSend()}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        Send
      </button>
      <button
        onClick={handleListen}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        {isListening ? "Listening..." : "Start Listening"}
      </button>
    </div>
  );
}
