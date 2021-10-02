// configure ckeditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import parser from "html-react-parser";
// import Followups from "./Followups";

import "../css/Compose.css";
import { useState } from "react";

const ComposeEmail = (props) => {
  //get email body data
  const [text, setText] = useState("");
  // get subject
  const [subject, setSubject] = useState("");
  // get Title
  const [title, setTitle] = useState("");
  //   const parseText = parser(text);

  // post data
  // const postData = async (event) => {
  //   event.preventDefault();
  //   const res = await fetch("/api/emails/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       text,
  //     }),
  //   });
  //   const data = await res.json();
  //   console.log("JSON DATA", data);
  //   if (!data) {
  //     window.alert("Invalid Registration");
  //     console.log("Invalid Registration");
  //   } else {
  //     window.alert("Windows");
  //   }
  // };

  // handle title onChange
  const handleTitle = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setTitle({ ...title, [name]: value });
  };

  // handle subject onChange
  const handleSubject = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setSubject({ ...subject, [name]: value });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={title.value}
        onChange={handleTitle}
      />
      <input
        type="text"
        placeholder="Subject"
        name="subject"
        value={subject.value}
        onChange={handleSubject}
      />
      <CKEditor
        editor={ClassicEditor}
        data={text}
        onChange={(event, editor) => {
          const data = editor.getData();
          setText(data);
          props.getEmailData(title, subject, data); //send props data from child to parent component
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "blockQuote",
            "numberedList",
            "bulletedList",
            "|",
            "undo",
            "redo",
          ],
        }}
      />
      {/* <button onClick={postData}>Send Data</button> */}

      <br />
      <br />
      <br />
    </>
  );
};

export default ComposeEmail;
