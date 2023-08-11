import mongoose from "mongoose";

const CodeBlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
});

export default mongoose.model("CodeBlock", CodeBlockSchema);
