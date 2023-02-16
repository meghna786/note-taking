import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";

import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { EditNote } from "./Components/EditNote";

import { NewNote } from "./Components/NewNote";
import { NoteLayout } from "./Components/NoteLayout";
import { NoteList } from "./Components/NoteList";
import { NoteShow } from "./Components/NoteShow";
import { useLocalStorage } from "./helpers/useLocalStorage";

export type Tag = {
  id: string;
  label: string;
};

export type NoteData = {
  title: string;
  body: string;
  tags: Tag[];
};
export type Note = {
  id: string;
} & NoteData;

export type RawNoteData = {
  title: string;
  body: string;
  tagIds: string[];
};

export type RawNote = {
  id: string;
} & RawNoteData;

export default function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(newTag: Tag) {
    setTags((prev) => [...prev, newTag]);
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else return tag;
      });
    });
  }

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else return note;
      });
    });
  }

  return (
    <Container className="m-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList availableTags={tags} notes={notesWithTags} deleteTag={deleteTag} updateTag={updateTag} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              addTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<NoteShow onDeleteNote={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                addTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Container>
  );
}

