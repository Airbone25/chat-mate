'use client';
import { useState } from "react";
import Sidebar from "../../components/SideBar";
import ChatWindow from "../../components/Chatwindow";

type Persona = { id: string; name?: string; tagline?: string; avatarUrl?: string };

export default function page() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>();
  const [chats, setChats] = useState<Record<string, any[]>>({});

  const selectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    if (!chats[persona.id]) setChats((c) => ({ ...c, [persona.id]: [] }));
  };

  return (
    <div className="flex h-screen">
      <Sidebar selected={selectedPersona} onSelect={selectPersona} chats={chats} />
      <ChatWindow persona={selectedPersona} chatHistory={chats[selectedPersona?.id] || []} setChats={setChats} />
    </div>
  );
}
