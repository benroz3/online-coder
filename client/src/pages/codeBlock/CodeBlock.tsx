import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CodeBlock.scss";

const CodeBlock: React.FC<{ socket: Socket }> = ({ socket }) => {
  const location = useLocation();
  const { codeBlock, isMentor } = location.state;
  const [editorState, setEditorState] = useState(codeBlock.code);
  const [mentorCode, setMentorCode] = useState("");
  const [smiley, setSmiley] = useState(false);

  useEffect(() => {
    //getting the changed code from the student
    if (isMentor)
      socket.on("codeChanged", ({ code }: { code: string }) => {
        setEditorState(code);
      });
  }, [socket, isMentor]);

  //student's code changes
  const handleChange = (editorState: string) => {
    setEditorState(editorState);
    if (!isMentor) socket.emit("codeChange", editorState);
    socket.on("isCorrect", (status) => setSmiley(status));
  };

  //mentor's code changes
  const handleMentorChange = (mentorCode: string) => {
    setMentorCode(mentorCode);
    socket.emit("mentorCodeChange", mentorCode);
  };

  //save code to database
  const handleSaveClick = () => {
    if (!isMentor)
      socket.emit("saveCodeBlock", {
        id: codeBlock._id,
        code: editorState,
      });

    //save message
    toast.success("Data saved successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="codeBlock">
      <div className="nav">
        <Link to="/" className="link">
          <ArrowBackIcon className="icon" />
        </Link>
        <div className="title">{codeBlock?.title}</div>
        {!isMentor && (
          <>
            <button onClick={handleSaveClick}>Save</button>
            {smiley && <EmojiEmotionsIcon className="smiley" />}
          </>
        )}
      </div>
      <div className="container">
        <div className="blockContainer">
          {isMentor && <div className="title">Student's Code:</div>}
          <CodeMirror
            height="100%"
            theme="dark"
            value={editorState}
            readOnly={isMentor}
            style={{
              width: "100%",
              fontSize: "20px",
            }}
            extensions={[javascript({ jsx: true })]}
            onChange={handleChange}
          />
        </div>
        {isMentor && (
          <div className="blockContainer">
            <div className="title">Mentor's solution:</div>
            <CodeMirror
              height="100%"
              theme="dark"
              value={mentorCode}
              style={{
                width: "100%",
                fontSize: "20px",
              }}
              extensions={[javascript({ jsx: true })]}
              onChange={handleMentorChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
