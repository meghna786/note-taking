import { NoteData, Tag } from "../App";
import { NewForm } from "./NewForm";

type NewNoteProps={
      onSubmit: (data:NoteData)=>void
      addTag: (newTag: Tag)=>void
      availableTags: Tag[]
}

export function NewNote({onSubmit, addTag, availableTags}:NewNoteProps){

      return <>
            <h1 className="mb-4" >New Note</h1>
            <NewForm onSubmit={onSubmit} addTag={addTag} availableTags={availableTags} />
      </>

}