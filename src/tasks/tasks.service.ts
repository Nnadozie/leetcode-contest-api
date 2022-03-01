import { Injectable, Logger } from '@nestjs/common';
import { DataService } from './data.service';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Contestant {
  rank: number;
  finish_time: number;
  score: number;
}

export interface Contest {
  url: URL;
  contestNumber: number;
  lastPage?: number;
  /**
   * Number of contestants.
   * Gotten as lastPage x 25.
   */
  totalContestants?: number;
}

export interface Response {
  total_rank: Contestant[];
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  _called = 0;

  constructor(
    private dataService: DataService,
    private httpService: HttpService,
  ) {
    this.onStartUp(
      this.dataService.leetcodeDb.keys,
      this.dataService.mockDb.keys,
    );
  }

  /**
   * Finds the last page with a non-zero finish time
   **/
  async findLastPage(page = 0, step = 100): Promise<number> {
    return;
  }

  /**
   * Gets all competitors on a page with the given url
   **/
  async getCompetitors(url: string): Promise<Contestant[]> {
    return;
  }

  /**
   * Scrape all useful entries from a Leetcode contest
   * and return an array of entries
   **/
  async scrapeContestData(contest: Contest): Promise<Contestant[]> {
    /**
     * This recursive approach assumes 500bytes per stack call
     * and a lastPage typically <= 1000
     * for a rough estimation of 500kb of stack space needed
     *
     * The default node stack size is 984kb so for a typical
     * contest this should be fine. If not, needs refactoring.
     *
     * Or increase stack space...
     */
    if (contest.lastPage === 0) return [];
    contest.url.searchParams.set('pagination', contest.lastPage.toString());

    const res = await firstValueFrom(
      this.httpService.get<Response>(contest.url.toString()),
    );

    contest.lastPage--;

    return [...(await this.scrapeContestData(contest)), ...res.data.total_rank];
  }

  /**
   * Store entries for a contest in our DB.
   * Tell us if the operation was successful or not.
   **/
  storeContestData(contest: Contest, data: Contestant[]): boolean {
    return;
  }

  @Cron('* 30 4 * * sun')
  handleWeekly(): void {
    this._called += 1;
  }

  @Cron('* 30 16 * * sat')
  handleBiWeekly(): void {
    if (
      this.dataService.leetcodeDb.lastBiWeeklyKey === undefined ||
      !this.dataExistsInDb(
        this.dataService.leetcodeDb.lastBiWeeklyKey,
        this.dataService.mockDb.keys,
      )
    )
      this._called += 1;
  }

  dataExistsInDb(key: Date, mockDb: string[]): boolean {
    const ISOFomat = key.toISOString();
    const mockDbKeySet = new Set();

    mockDb.forEach((key) => mockDbKeySet.add(key));

    return mockDbKeySet.has(ISOFomat.substring(0, ISOFomat.indexOf('T')));
  }

  onStartUp(leetcodeDb: string[], mockDb: string[]) {
    const mockDbKeySet = new Set();

    mockDb.forEach((key) => mockDbKeySet.add(key));

    leetcodeDb.forEach((key) => {
      if (!mockDbKeySet.has(key)) {
        this._called += 1;
      }
    });
  }
}
