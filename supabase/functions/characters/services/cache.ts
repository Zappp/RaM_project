import { ms } from "shared/utils.ts";
import { RemoteCharacter } from "../types.ts";
import { Milliseconds } from "shared/types/utils.ts";
import { RepositoryService } from "./repository.ts";
import { RemoteApiClientService } from "./remoteApiClient.ts";

export class CacheService {
  private totalCount: number | null = null;

  private readonly TOTAL_COUNT_EXPIRY_MS = ms(6, "h");
  private readonly CHARACTERS_EXPIRY_MS = ms(1, "d");

  constructor(
    private readonly repo: RepositoryService,
    private readonly remote: RemoteApiClientService,
  ) {}

  async ensureTotalCount() {
    const cached = await this.repo.loadTotalCount();
    const expired = cached
      ? this._expired(cached.updated_at, this.TOTAL_COUNT_EXPIRY_MS)
      : true;

    if (!cached || expired) {
      await this._refreshTotalCountFromRemote();
    } else {
      this.totalCount = cached.total_count;
    }
  }

  async getCharacters(pages: number[]) {
    const results = [];
    for (const p of pages) {
      const page = await this._getPage(p);
      results.push(...page.characters as RemoteCharacter[]);

      if (!page.fromDB && page.totalCount !== this.totalCount) {
        await this._refreshTotalCountFromRemote();
      }
    }
    return results;
  }

  private async _getPage(remotePage: number) {
    const cached = await this.repo.loadPage(remotePage);

    if (
      cached && !this._expired(cached.updated_at, this.CHARACTERS_EXPIRY_MS)
    ) {
      return { fromDB: true, characters: cached.characters };
    }

    const remote = await this.remote.getCharactersPage(remotePage);
    await this.repo.savePage(remotePage, remote.results);

    return {
      fromDB: false,
      characters: remote.results,
      totalCount: remote.info.count,
    };
  }

  private async _refreshTotalCountFromRemote() {
    const remote = await this.remote.getCharactersPage(1);
    const newCount = remote.info.count;

    if (this.totalCount && this.totalCount !== newCount) {
      await this.repo.purgeCharacters();
    }

    this.totalCount = newCount;
    await this.repo.saveTotalCount(newCount);
  }

  private _expired(updatedAt: string, ms: Milliseconds) {
    return Date.now() - new Date(updatedAt).getTime() > ms;
  }

  get count() {
    return this.totalCount;
  }
}
