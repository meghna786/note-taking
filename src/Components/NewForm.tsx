import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {v4 as uuidV4} from 'uuid';
import CreatableReactSelect from "react-select/creatable";


import { NoteData, Tag } from "../App";

type NewFormProps = {
  onSubmit: (data: NoteData) => void;
  addTag: (newTag: Tag)=>void
  availableTags: Tag[]
}& Partial<NoteData>;

export function NewForm({ title="", body="", tags=[], onSubmit, addTag, availableTags }: NewFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate= useNavigate();


  function handleSubmit(e: FormEvent){
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      body: bodyRef.current!.value,
      tags: selectedTags,
    });
    navigate("..");

  };

  return (
      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control ref={titleRef} required  defaultValue={title} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <CreatableReactSelect
                  onCreateOption={label=>{
                    const newTag={id: uuidV4(), label }
                    addTag(newTag)
                    setSelectedTags(prev=> [...prev,newTag])
                  }}
                  value={selectedTags.map((tag) => {
                    return { label: tag.label, value: tag.id }
                  })}

                  onChange= {tags=>{ 
                    setSelectedTags(tags.map(tag=>{
                    return { label: tag.label, id: tag.value}
                  }))
                }}
                  options={availableTags.map(tag=>{
                    return {label:tag.label, value: tag.id}
                  })}
                  
                  isMulti
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="body">
                <Form.Label>Body</Form.Label>
                <Form.Control required as="textarea" ref={bodyRef} rows={15} defaultValue={body} />
              </Form.Group>
            </Col>
          </Row>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
  );
}
