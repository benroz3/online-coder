import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import { setCodeBlocks, setIsMentor } from "../../redux/slices/codeBlockSlice";
import { CodeBlockType, RootState } from "../../types/types";
import "./Lobby.scss";

const Lobby: React.FC<{ socket: Socket }> = ({ socket }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    //connection
    socket.on("connect", () => {
      console.log("Connected to socket server!");
      socket.emit("fetchCodeBlocks");
    });

    //setting mentor / student
    socket.on("mentor-status", (status: boolean) => {
      dispatch(setIsMentor(status));
    });

    //fetching all codeBlocks
    socket.on("codeBlocks", (fetchedCodeBlocks) => {
      dispatch(setCodeBlocks(fetchedCodeBlocks));
      setIsLoading(false);
    });
  }, [socket, dispatch]);

  const { codeBlocks, isMentor } = useSelector(
    (state: RootState) => state.codeBlocks
  );

  return (
    <div className="lobby">
      <div className="title">Choose code block</div>
      {isLoading ? (
        <div className="waiting">Loading...</div>
      ) : (
        <div className="codeLinksContainer">
          {codeBlocks.map((block: CodeBlockType) => (
            <Link
              to={`/code-block/${block.title}`}
              state={{ codeBlock: block, isMentor }}
              className="link"
              key={block._id}
            >
              {block.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lobby;
