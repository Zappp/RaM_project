import z from "@zod";
import { remoteCharacterSchema } from "./validationSchema.ts";

export type RemoteCharacter = z.infer<typeof remoteCharacterSchema>;
export type GetPage = {
  fromDB: false;
  totalCount: number;
  characters: RemoteCharacter[];
} | { fromDB: true; characters: RemoteCharacter[] };

export interface PageInfo {
  count: number | null;
  pages: number | null;
  prev: number | null;
  next: number | null;
}
