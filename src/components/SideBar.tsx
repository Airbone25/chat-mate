"use client";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

type Persona = { id: string; name?: string; tagline?: string; avatarUrl?: string };

type SidebarProps = {
  selected: Persona;
  onSelect: (persona: Persona) => void;
  // chats: Record<string, any[]>;
  // unread: Record<string, number>; 
};

export default function Sidebar({ selected, onSelect}: SidebarProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    fetchPersonas();
  }, []);

  async function fetchPersonas() {
    try {
      const response = await axios.get("/api/chat");
      const data = response.data;
      console.log("Fetched personas:", data);
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  }

  return (
    <div className="w-[300px] bg-[#1f1f1f] border-r border-[#333] text-white">
      <div className="flex justify-between p-4 border-b border-[#333] relative">
        <div className="p-4 font-bold text-xl">Chat-Mates</div>
        <div className="flex items-center space-x-2">
            <FaMagnifyingGlass className="text-gray-400" />
            <FiMoreVertical className="text-gray-400" />
        </div>
      </div>
      {personas.map((p) => (
        <div
          key={p.id}
          className={`flex items-center p-3 cursor-pointer hover:bg-[#2a2a2a] ${
            selected?.name === p.name ? "bg-[#2a2a2a]" : ""
          }`}
          onClick={() => onSelect(p)}
        >
          <div className="relative">
            <img src={p.avatarUrl} alt="dp" className="rounded-full h-10 mr-3" />
            {/* {unread?.[p.name] > 0 && selected !== p.name && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-[#1f1f1f]" />
            )} */}
          </div>
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-400">{p.tagline}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
