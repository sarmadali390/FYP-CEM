import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Followups = (props) => {
  const [text, setText] = useState();
  const [followup0Subject, setFollowup0Subject] = useState("");
  const [followup0Days, setFollowup0Days] = useState("");

  // console.log(text);
  // console.log(props.id);

  // handle subject onChange
  const handleSubject = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFollowup0Subject({ [name]: value });
  };

  // handle days onChange()
  const handleDays = (event) => {
    event.preventDefault();
    console.log("followup: ", props.id);
    const { name, value } = event.target;
    setFollowup0Days(value);
  };
  useEffect(() => {
    console.log("followup0days:", followup0Days);
  });

  return (
    <div>
      <input
        type="text"
        placeholder="number of days"
        name="days"
        value={followup0Days}
        onChange={handleDays}
        // onChange={handleChanged}
      />
      <input
        type="text"
        placeholder="Subject"
        name="subject"
        // onChange={handleChanged}
        value={followup0Subject.value}
        onChange={handleSubject}
      />
      <input type="text" placeholder="On Reply" disabled />
      <CKEditor
        editor={ClassicEditor}
        data={text}
        // value={text.emailBody}
        onChange={(event, editor) => {
          const data = editor.getData();

          // setText(data.emailBody);
          if (props.id === 0) {
            props.getText(data, props.id, followup0Days, followup0Subject);
          }
          // if (props.id === 1) {
          //   props.getText(data, props.id, followupDays, followupSubject);
          // }
          // if (props.id === 2) {
          //   props.getText(data, props.id, followupDays, followupSubject);
          // }
          // if (props.id === 3) {
          //   props.getText(data, props.id, followupDays, followupSubject);
          // }
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

      {/* <button onClick={buttonClicked}>Follow-ups</button> */}
    </div>
  );
};
export default Followups;
