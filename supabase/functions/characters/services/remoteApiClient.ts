import { remoteCharactersSchema } from "../validationSchema.ts";

export class RemoteApiClientService {
  static readonly REMOTE_PAGE_SIZE = 20;
  constructor(
    private readonly API_URL: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async getCharactersPage(page: number) {
    const res = await this.fetcher(`${this.API_URL}/character?page=${page}`);
    const json = await res.json();
    const parsed = remoteCharactersSchema.safeParse(json);
    if (!parsed.success) throw new Error("Invalid remote response");

    return parsed.data;
  }
}
