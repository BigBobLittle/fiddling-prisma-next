import { Note } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useState } from "react";
const { prisma } = require("../lib/prisma");
const inter = Inter({ subsets: ["latin"] });

interface FormData {
  title: string;
  content: string;
  id: string;
}

export type Props = {
  notes: Note[];
};
export default function Home({ notes }: Props) {
  // create new note
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });

  const refreshData = () => {
    // window.location.reload();
    router.replace(router.asPath);
  };
  async function createNote(data: FormData) {
    try {
      // simulate update by deleting the node and creating a new one
      if(data.id) deleteNote(Number(data.id))
        
      await fetch("http://localhost:3000/api/create", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      setForm({ title: "", content: "", id: "" });
      // return response.json();
      refreshData();
    } catch (error) {
      // setForm({ title: "", content: "", id: "" });
      console.log(error);
      return error;
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      await createNote(data);
    } catch (error) {
      console.log(error);
    }
  };

  // delete note
  async function deleteNote(id: number) {
    
    try {
      const response = await fetch(`http://localhost:3000/api/note/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log({ "response=> ": response });
      if (response.ok) {
        refreshData();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div className="text-center font-bold text-2xl mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
          className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-2 rounded border-gray-600 p-1"
          />

          <textarea
            placeholder="Content"
            className="border-2 rounded border-gray-600 p-1"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          ></textarea>

          <button type="submit" className="bg-blue-500 p-1 rounded text-white">
            Add +
          </button>
        </form>
      </div>

      <div className="text-center font-bold  mt-4">
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="border-2 rounded border-gray-600 p-1">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="font-bold">{note.title}</div>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 px-3 text-white"
                >
                  x
                </button>

                <button
                onClick={() => setForm({ ...form, title: note.title, content: note.content, id: String(note.id) })}
                className="bg-blue-500 px-3 text-white"
                >Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      content: true,
      id: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
