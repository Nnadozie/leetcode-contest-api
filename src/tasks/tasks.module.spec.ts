import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Contest, Contestant, Response, TasksService } from './tasks.service';
import * as sinon from 'sinon';
import { DataService } from './data.service';
import { TasksModule } from './tasks.module';
import { INestApplication } from '@nestjs/common';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

describe('TasksService', () => {
  let app: INestApplication;

  const cronTest = async ({
    mockDate,
    clockTick,
    dayExpected,
    callsExpected,
    callsExpectedOnStartup = 0,
    mockDataService,
  }) => {
    mockDataService = mockDataService
      ? mockDataService
      : {
          mockDb: {
            keys: [],
          },
          leetcodeDb: {
            keys: [],
            lastBiWeeklyKey: undefined,
          },
        };

    const module = await Test.createTestingModule({
      imports: [
        {
          module: AppModule,
        },
      ],
    })
      .overrideProvider(DataService)
      .useValue(mockDataService)
      .compile();

    app = module.createNestApplication();

    const service = app.get(TasksService);
    expect(service._called).toBe(callsExpectedOnStartup);

    const clock = sinon.useFakeTimers({
      now: new Date(mockDate).valueOf(),
    });
    await app.init();
    clock.tick(clockTick);
    expect(new Date().getDay()).toBe(dayExpected);
    expect(service._called).toBe(callsExpected);
  };

  describe('handleWeekly', () => {
    const weeklyTestCases = [
      {
        name: 'Feb 13 at 4:30AM, TO BE called',
        mockDate: '2022-02-13T04:30Z',
        clockTick: 3000,
        dayExpected: 0,
        callsExpected: 3,
      },
      {
        name: 'a day after Feb 13 at 4:30AM, to NOT BE called',
        mockDate: '2022-02-14T04:30Z',
        clockTick: 2000,
        dayExpected: 1,
        callsExpected: 0,
      },
      {
        name: 'a week after Feb 13 at 4:30AM, TO BE called',
        mockDate: '2022-02-20T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      {
        name: '2 weeks after Feb 13 at 4:30AM, TO BE called',
        mockDate: '2022-02-27T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      {
        name: 'one minute before, should NOT BE called',
        mockDate: '2022-02-20T04:29Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'restart: one minute after, TO HAVE BEEN called',
        mockDate: '2022-02-27T04:31Z',
        clockTick: 60000,
        dayExpected: 0,
        callsExpectedOnStartup: 3,
        callsExpected: 3,
        mockDataService: {
          mockDb: {
            keys: ['2022-02-12'],
          },
          leetcodeDb: {
            keys: ['2022-02-13', '2022-02-20', '2022-02-27'],
            lastBiWeeklyKey: new Date('2022-02-27'),
          },
        },
      },
      {
        name: 'one hour before, should NOT BE  be called',
        mockDate: '2022-02-20T03:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'restart: one hour after, TO HAVE BEEN called',
        mockDate: '2022-02-20T05:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpectedOnStartup: 2,
        callsExpected: 2,
        mockDataService: {
          mockDb: {
            keys: ['2022-02-12'],
          },
          leetcodeDb: {
            keys: ['2022-02-13', '2022-02-20'],
            lastBiWeeklyKey: new Date('2022-02-20'),
          },
        },
      },
      {
        name: 'one year later, TO BE called',
        mockDate: '2023-02-19T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
    ];

    test.each(weeklyTestCases)(
      '$name',
      async ({
        mockDate,
        clockTick,
        dayExpected,
        callsExpected,
        callsExpectedOnStartup = 0,
        mockDataService,
      }) =>
        cronTest({
          mockDate,
          clockTick,
          dayExpected,
          callsExpected,
          callsExpectedOnStartup,
          mockDataService,
        }),
    );

    afterAll(async () => {
      await app.close();
    });
  });

  describe('handleBiWeekly', () => {
    const biWeeklyTestCases = [
      {
        name: 'Feb 19 at 4:30 PM, TO BE called',
        mockDate: '2022-02-19T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 3,
      },
      {
        name: 'a day after Feb 19 at 4:30PM, to NOT BE  called',
        mockDate: '2022-02-20T16:30Z',
        clockTick: 3000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'regular run: a week after Feb 19 at 4:30PM, to NOT BE called',
        mockDate: '2022-02-26T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 0,
        mockDataService: {
          mockDb: {
            keys: ['2022-02-19'],
          },
          leetcodeDb: {
            keys: [],
            lastBiWeeklyKey: new Date('2022-02-19'),
          },
        },
      },
      {
        name: '2 weeks after Feb 19, March 5 at 4:30PM, TO BE called',
        mockDate: '2022-03-05T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 3,
      },
      {
        name: 'one minute before, should NOT BE called',
        mockDate: '2022-02-19T16:29Z',
        clockTick: 4000,
        dayExpected: 6,
        callsExpected: 0,
      },
      {
        name: 'restart: one minute after, TO HAVE BEEN called',
        mockDate: '2022-02-19T16:31Z',
        clockTick: 4000,
        dayExpected: 6,
        callsExpectedOnStartup: 1,
        callsExpected: 1,
        mockDataService: {
          mockDb: {
            keys: ['2022-02-12'],
          },
          leetcodeDb: {
            keys: ['2022-02-12', '2022-02-19'],
            lastBiWeeklyKey: new Date('2022-02-19'),
          },
        },
      },
    ];

    test.each(biWeeklyTestCases)(
      '$name',
      async ({
        mockDate,
        clockTick,
        dayExpected,
        callsExpected,
        callsExpectedOnStartup = 0,
        mockDataService,
      }) =>
        cronTest({
          mockDate,
          clockTick,
          dayExpected,
          callsExpected,
          callsExpectedOnStartup,
          mockDataService,
        }),
    );

    afterAll(async () => {
      await app.close();
    });
  });

  describe('scrapeContestData', () => {
    let module: TestingModule;
    const mockDataService = {
      mockDb: {
        keys: ['2022-02-12'],
      },
      leetcodeDb: {
        keys: ['2022-02-13', '2022-02-20'],
        lastBiWeeklyKey: new Date('2022-02-20'),
      },
    };

    let server: SetupServerApi;
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          {
            module: TasksModule,
          },
        ],
      })
        .overrideProvider(DataService)
        .useValue(mockDataService)
        .compile();
    });

    afterEach(() => {
      server.resetHandlers();
    });

    afterAll(() => {
      server.close();
    });
    interface MockContest extends Contest {
      mockResponse: { [key: number]: Response };
    }

    const contests: MockContest[] = [
      {
        url: new URL(
          //'?pagination=55&region=global',
          'https://leetcode.com/contest/api/ranking/mock-contest-0/',
        ),
        totalContestants: 100,
        contestNumber: 0,
        lastPage: 4,
        mockResponse: {
          1: {
            total_rank: new Array<Contestant>(25).fill({
              rank: 1,
              finish_time: 1,
              score: 1,
            }),
          },
          2: {
            total_rank: new Array<Contestant>(25).fill({
              rank: 1,
              finish_time: 1,
              score: 1,
            }),
          },
          3: {
            total_rank: new Array<Contestant>(25).fill({
              rank: 1,
              finish_time: 1,
              score: 1,
            }),
          },
          4: {
            total_rank: new Array<Contestant>(25).fill({
              rank: 1,
              finish_time: 1,
              score: 1,
            }),
          },
        },
      },
      {
        url: new URL('https://contest.com/'),
        totalContestants: 0,
        contestNumber: 0,
        lastPage: 1,
        mockResponse: { 1: { total_rank: [] } },
      },
    ];

    test.each(contests)(
      'contest of $totalContestants contestants, returns array of length $totalContestants',
      async (contest) => {
        const service = module.get(TasksService);

        server = setupServer(
          rest.get(contest.url.toString(), (req, res, ctx) => {
            return res(
              ctx.json(
                contest.mockResponse[
                  contest.url.searchParams.get('pagination')
                    ? contest.url.searchParams.get('pagination')
                    : 1
                ],
              ), //How to tell typescript pagination exists
            );
          }),
        );
        server.events.on('response:mocked', async (res, reqId) => {
          //console.log('sent a mocked response', reqId, res);
        });
        server.listen();

        const result = await service.scrapeContestData(contest);

        console.log(result);

        expect(result.length).toBe(contest.totalContestants);
      },
    );
    test('contest of 3 entries, returned entries match contest entries', async () => {
      const contest = {
        url: new URL('https://contest.com/'),
        totalContestants: 3,
        contestNumber: 0,
        lastPage: 4,
      };

      const mockHttpRes: Response = {
        total_rank: [
          { rank: 1, finish_time: 22435234, score: 13 },
          { rank: 2, finish_time: 5245245, score: 10 },
          { rank: 3, finish_time: 1234254, score: 7 },
        ],
      };

      server = setupServer(
        rest.get(contest.url.toString(), (req, res, ctx) => {
          return res(ctx.json(mockHttpRes));
        }),
      );
      server.listen();

      const service = module.get(TasksService);

      const result = await service.scrapeContestData(contest);
      expect(result).toEqual(mockHttpRes.total_rank);
    });

    test('contest of 50 entries, returned entries match contest entries', async () => {
      const contest = {
        url: new URL('https://contest.com'),
        totalContestants: 3,
        contestNumber: 0,
        lastPage: 4,
      };

      const mockHttpRes: Response = {
        total_rank: [
          { rank: 5, finish_time: 2452452, score: 13 },
          { rank: 6, finish_time: 1254245, score: 15 },
          { rank: 7, finish_time: 1245254, score: 12 },
          { rank: 8, finish_time: 1245245, score: 15 },
          { rank: 9, finish_time: 1245254, score: 12 },
        ],
      };

      server = setupServer(
        rest.get(contest.url.toString(), (req, res, ctx) => {
          return res(ctx.json(mockHttpRes));
        }),
      );
      server.listen();

      const service = module.get(TasksService);
      const result = await service.scrapeContestData(contest);
      expect(result).toEqual(mockHttpRes.total_rank);
    });
    test.todo('contest of n entries, returned entries match given entries');
  });
});
