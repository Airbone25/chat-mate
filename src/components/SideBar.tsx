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

export default function Sidebar({ selected, onSelect }: SidebarProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchPersonas();
  }, []);

  async function fetchPersonas() {
    try {
      const response = await axios.get("/api/personas");
      const data = response.data;
      console.log("Fetched personas:", data);
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  }

  function filteredPersonas() {
    if (!query) return personas;
    return personas.filter((p) =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <div className="w-[300px] bg-[#1f1f1f] border-r border-[#333] text-white h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="p-4 font-bold text-xl">Chat-Mates</div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setOpen(!open)}>
            <FaMagnifyingGlass className="text-gray-400" />
          </button>
          <div className="relative">
            <button onClick={() => setOpenMenu(!openMenu)}>
              <FiMoreVertical className="text-gray-400" />
            </button>
            {openMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-[#232323] border border-[#333] rounded shadow-lg z-20">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-[#333] cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-[#333] cursor-pointer">Settings</li>
                  <li className="px-4 py-2 hover:bg-[#333] cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="sticky top-0 z-10 bg-[#1f1f1f] p-4 border-b border-[#333]">
          <input
            type="text"
            placeholder="Search personas..."
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-md focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}
      {open && filteredPersonas().map((p) => (
        <div
          key={p.id}
          className={`flex items-center p-3 cursor-pointer hover:bg-[#2a2a2a] ${selected?.name === p.name ? "bg-[#2a2a2a]" : ""
            }`}
          onClick={() => onSelect(p)}
        >
          <div className="relative">
            <img src={`/${p.avatarUrl}`} alt="dp" className="rounded-full h-10 mr-3" />
          </div>
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-400">{p.tagline}</div>
          </div>
        </div>
      ))}
      <div className="flex-1 overflow-y-auto">
        {!open && personas.map((p) => (
          <div
            key={p.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-[#2a2a2a] ${selected?.name === p.name ? "bg-[#2a2a2a]" : ""
              }`}
            onClick={() => onSelect(p)}
          >
            <div className="relative">
              <img src={`/${p.avatarUrl}`} alt="dp" className="rounded-full h-10 mr-3" />
            </div>
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-400">{p.tagline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
