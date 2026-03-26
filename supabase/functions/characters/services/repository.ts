import { Database } from "shared/types/database.types.ts";
import { SupabaseClient } from "@supabase";
import { RemoteCharacter } from "../types.ts";

export class RepositoryService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly supabaseAdmin: SupabaseClient<Database>,
  ) {}

  async loadPage(page: number) {
    const { data, error } = await this.supabase
      .from("remote_characters")
      .select()
      .eq("remote_page", page)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async savePage(page: number, characters: RemoteCharacter[]) {
    const { error } = await this.supabaseAdmin
      .from("remote_characters")
      .upsert({ remote_page: page, characters }, { onConflict: "remote_page" });

    if (error) throw error;
  }

  async loadTotalCount() {
    const { data, error } = await this.supabase
      .from("remote_characters_count")
      .select()
      .eq("id", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async saveTotalCount(count: number) {
    const { error } = await this.supabaseAdmin
      .from("remote_characters_count")
      .upsert({ total_count: count });
    if (error) throw error;
  }

  async purgeCharacters() {
    await this.supabaseAdmin.from("remote_characters").delete();
  }
}
