'use client';
import { useState } from "react";
import Sidebar from "../../components/SideBar";
import ChatWindow from "../../components/Chatwindow";

type Persona = { id: string; name?: string; tagline?: string; avatarUrl?: string }
type ChatMessage = {
  sender: string;
  content: string;
};

export default function Page() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>();
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    if (!chats[persona.id]) setChats((c) => ({ ...c, [persona.id]: [] }));
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar
        selected={selectedPersona!}
        onSelect={selectPersona}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col">
        {!selectedPersona && (
          <div className="md:hidden bg-[#1f1f1f] p-4 text-white font-bold border-b border-[#333] flex justify-between items-center">
            <div>Chat-Mates</div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-white text-xl">☰</button>
          </div>
        )}
        <ChatWindow
          persona={selectedPersona!}
          chatHistory={chats[selectedPersona?.id!] || []}
          setChats={setChats}
        />
      </div>
    </div>
  );
}

