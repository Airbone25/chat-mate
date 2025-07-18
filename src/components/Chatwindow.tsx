"use client";
import { useState } from "react";
import axios from "axios";
import Loading from "./Loading";

interface ChatMessage {
    sender: string;
    content: string;
}

type Persona = { id: string; name?: string; tagline?: string; avatarUrl?: string };

interface ChatWindowProps {
    persona: Persona;
    chatHistory: ChatMessage[];
    setChats: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
    toggleSidebar: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ persona, chatHistory, setChats,toggleSidebar }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    console.log("Persona in ChatWindow:", persona);

    const sendMessage = async () => {
        setLoading(true);
        if (!input.trim()) {
            setLoading(false);
            return;
        }

        const newHistory = [...chatHistory, { sender: "user", content: input }];
        setChats((prev) => ({ ...prev, [persona.id]: newHistory }));
        setInput("");

        const userId = "user-id-placeholder"; // TODO: Replace with actual user ID logic

        const res = await axios.post("/api/chat", {
            message: input,
            personaId: persona.id,
            chatHistory,
            userId,
        });

        setChats((prev) => ({
            ...prev,
            [persona.id]: [...newHistory, { sender: "bot", content: res.data.reply }],
        }));
        setLoading(false);
        setInput("");
    };

    if (!persona?.id)
        return <div className="flex-1 bg-[#111] flex items-center justify-center text-gray-400">Select a friend to chat</div>;

    return (
        <div className="flex flex-col flex-1 bg-[#111]">
            <div className="flex justify-between bg-[#1f1f1f] p-3 text-white font-bold border-b border-[#333]">
                <div className="flex items-center">
                    <img src={`/${persona.avatarUrl}`} alt="dp" className="rounded-full h-10 mr-3"/>
                    {persona.name?.toUpperCase()}
                </div>
                <button className="md:hidden text-white text-xl mr-2" onClick={toggleSidebar}>
                    ☰
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.sender === "user"
                                ? "bg-[#0b93f6] text-white"
                                : "bg-[#2a2a2a] text-gray-200"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="max-w-[75%] px-4 py-2 rounded-2xl bg-[#2a2a2a] text-gray-200">
                            <Loading />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-[#333] flex items-center">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-[#2a2a2a] text-white p-2 rounded-lg outline-none"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-[#0b93f6] text-white rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
