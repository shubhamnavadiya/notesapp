export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Signup: undefined;
  Home: undefined;
  CreateNote: undefined;
  EditNote: { note: Note };
};
