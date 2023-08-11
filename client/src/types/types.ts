export interface CodeBlockType {
  _id: string;
  title: string;
  code: string;
}

export interface RootState {
  codeBlocks: {
    codeBlocks: CodeBlockType[];
    isMentor: boolean;
  };
}
