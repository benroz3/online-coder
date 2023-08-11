import { Server as SocketIOServer, Socket } from "socket.io";
import CodeBlock from "./models/CodeBlockModel";

const createWebSocketServer = (io: SocketIOServer) => {
  let mentorSocket: Socket | null = null;
  let studentSocket: Socket | null = null;
  let mentorCode = "";

  io.on("connection", async (socket: Socket) => {
    //handling connections
    if (!mentorSocket) {
      mentorSocket = socket;
      console.log("Mentor connected.");
      socket.emit("mentor-status", true);
    } else if (mentorSocket && !studentSocket) {
      studentSocket = socket;
      console.log("Student connected.");
      socket.emit("mentor-status", false);
    } else {
      socket.disconnect(true); //disconnecting any additional clients
      console.log("Another client tried to connect.");
    }

    //handling disconnections
    socket.on("disconnect", async (codeBlockId, codeFromStudent) => {
      if (socket === studentSocket) {
        console.log("Student disconnected.");
        studentSocket = null;
      }

      if (socket === mentorSocket) {
        console.log("Mentor disconnected.");
        mentorSocket = null;
      }
    });

    //fetching code blocks
    try {
      const codeBlocks = await CodeBlock.find();
      socket.emit("codeBlocks", codeBlocks);
    } catch (error) {
      console.error("Error fetching code blocks:", error);
    }

    //handling student code changes
    socket.on("codeChange", (code: string) => {
      if (studentSocket === socket && mentorSocket) {
        mentorSocket.emit("codeChanged", { code });
        io.emit("isCorrect", code === mentorCode);
      }
    });

    //handling mentor code changes
    socket.on("mentorCodeChange", (code: string) => {
      if (mentorSocket === socket) mentorCode = code;
    });

    //handling code save
    socket.on("saveCodeBlock", async ({ id, code }) => {
      try {
        const updatedCodeBlock = await CodeBlock.findByIdAndUpdate(
          id,
          { code },
          { new: true }
        );

        if (updatedCodeBlock) io.emit("updatedCodeBlock", updatedCodeBlock);
      } catch (error) {
        console.error("Error updating code block:", error);
      }
    });
  });

  return io;
};

export default createWebSocketServer;
