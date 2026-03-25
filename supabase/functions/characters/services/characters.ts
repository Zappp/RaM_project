import { PageInfo, RemoteCharacter } from "../types.ts";
import { CacheService } from "./cache.ts";
import { RemoteApiClientService } from "./remoteApiClient.ts";
import { RepositoryService } from "./repository.ts";

export class CharactersService {
  private cache: CacheService;
  constructor(
    private repo: RepositoryService,
    private remote: RemoteApiClientService,
  ) {
    this.cache = new CacheService(this.repo, this.remote);
  }

  private _computeRemotePages(start: number, pageSize: number) {
    const end = start + pageSize;

    const remoteStartPage =
      Math.floor(start / RemoteApiClientService.REMOTE_PAGE_SIZE) + 1;
    const remoteEndPage = Math.ceil(
      end / RemoteApiClientService.REMOTE_PAGE_SIZE,
    );

    return {
      pages: Array.from(
        { length: remoteEndPage - remoteStartPage + 1 },
        (_, i) => remoteStartPage + i,
      ),
      remoteStartPage,
    };
  }

  private _computeSliceAndPageInfo(
    start: number,
    pageSize: number,
    characters: RemoteCharacter[],
    currentPage: number,
    totalCount: number | null,
  ) {
    const sliced = characters.slice(start, start + pageSize);
    const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : null;
    const pageInfo = {
      count: totalCount,
      pages: totalPages,
      prev: currentPage > 1 ? currentPage - 1 : null,
      next: totalPages && currentPage < totalPages ? currentPage + 1 : null,
    };

    return { sliced, pageInfo };
  }

  async getPage(
    page: number,
    pageSize: number,
  ): Promise<{ results: RemoteCharacter[]; pageInfo: PageInfo }> {
    const start = (page - 1) * pageSize;

    await this.cache.ensureTotalCount();

    const { pages: remotePages, remoteStartPage } = this._computeRemotePages(
      start,
      pageSize,
    );

    const characters = await this.cache.getCharacters(remotePages);

    const { sliced, pageInfo } = this._computeSliceAndPageInfo(
      start - (remoteStartPage - 1) * RemoteApiClientService.REMOTE_PAGE_SIZE,
      pageSize,
      characters,
      page,
      this.cache.count,
    );

    return { results: sliced, pageInfo };
  }
}
