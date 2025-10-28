import React, { useState, useEffect } from "react";
import { supabase } from "./supabase/client";

export default function Dashboard({ user }) {
  const [tab, setTab] = useState("movies"); // movies, books, albums
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [artist, setArtist] = useState(""); // albums only
  const [flash, setFlash] = useState("");

  // Fetch user-specific items for current tab
  const fetchItems = async () => {
    setFlash(""); // clear previous message
    setItems([]); // clear old items to avoid flicker
    const { data, error } = await supabase
      .from(tab)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setFlash("Failed to fetch items: " + error.message);
      setItems([]);
    } else {
      setItems(data);
    }
  };

  // Reset form and flash on tab change and fetch new items
  const handleTabChange = (newTab) => {
    if (tab !== newTab) {
      setTab(newTab);
      setTitle("");
      setNotes("");
      setStatus("");
      setArtist("");
      setFlash("");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [tab, user]);

  const addItem = async () => {
    if (!title) {
      setFlash("Title is required!");
      return;
    }
    let insertData = { user_id: user.id, title, notes, status };
    if (tab === "albums")
      insertData = { user_id: user.id, album_name: title, artist, notes, status };
    const { error } = await supabase.from(tab).insert([insertData]);
    if (error) {
      setFlash("Failed to add: " + error.message);
    } else {
      setFlash("Added!");
      setTitle("");
      setNotes("");
      setStatus("");
      setArtist("");
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from(tab).delete().eq("id", id);
    if (error) {
      setFlash("Failed to delete: " + error.message);
    } else {
      setFlash("Deleted!");
      fetchItems();
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setFlash("Logout failed: " + error.message);
    } else {
      setFlash("Logged out!");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">MuseShelf</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {["movies", "books", "albums"].map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {flash && (
        <div style={{ marginBottom: 10, color: "crimson" }}>{flash}</div>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tab === "albums" ? "Album Name" : "Title"}
          className="border p-1 rounded flex-grow min-w-[150px]"
        />
        {tab === "albums" && (
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            className="border p-1 rounded flex-grow min-w-[150px]"
          />
        )}
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="border p-1 rounded flex-grow min-w-[150px]"
        />
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          className="border p-1 rounded flex-grow min-w-[150px]"
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-2 mb-1 flex justify-between rounded"
          >
            <div>
              <strong>{tab === "albums" ? item.album_name : item.title}</strong>
              {tab === "albums" && item.artist ? ` by ${item.artist}` : ""}
              <br />
              <small>
                {item.notes} [{item.status}]
              </small>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="bg-red-500 text-white px-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
