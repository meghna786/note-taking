import { NoteData, Tag } from "../App";
import { NewForm } from "./NewForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  addTag: (newTag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({
  onSubmit,
  addTag,
  availableTags,
}: EditNoteProps) {
  const note = useNote();
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NewForm
        title={note.title}
        body={note.body}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        addTag={addTag}
        availableTags={availableTags}
      />
    </>
  );
}
