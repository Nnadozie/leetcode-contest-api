import { INestApplication } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';
import * as sinon from 'sinon';

describe('TasksService', () => {
  let app: INestApplication;
  let clock: sinon.SinonFakeTimers;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        {
          module: AppModule,
          imports: [ScheduleModule.forRoot(), TasksModule],
          providers: [TasksService],
        },
      ],
    }).compile();

    app = module.createNestApplication();
  });

  describe('scrapeContestData', () => {
    const testCases = [
      {
        name: 'Feb 13 at 4:30AM, scrapeContestData TO BE called',
        dateString: '2022-02-13T04:30Z',
        clockTick: 3000,
        dayExpected: 0,
        callsExpected: 3,
      },
      {
        name: 'a day after Feb 13 at 4:30AM, scrapeContestData to NOT BE called',
        dateString: '2022-02-14T04:30Z',
        clockTick: 2000,
        dayExpected: 1,
        callsExpected: 0,
      },
      {
        name: 'a week after Feb 13 at 4:30AM, scrapeContestData TO BE called',
        dateString: '2022-02-20T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      {
        name: '2 weeks after Feb 13 at 4:30AM, scrapeContestData TO BE called',
        dateString: '2022-02-27T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      {
        name: 'one minute before ,should NOT BE called',
        dateString: '2022-02-20T04:29Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'one minute after, TO HAVE BEEN called',
        dateString: '2022-02-20T04:31Z',
        clockTick: 60000,
        dayExpected: 0,
        callsExpected: 60,
      },
      {
        name: 'one hour before ,should NOT BE  be called',
        dateString: '2022-02-20T03:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'one hour after, TO HAVE BEEN called',
        dateString: '2022-02-20T05:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      {
        name: 'one year later, TO BE called',
        dateString: '2023-02-19T04:30Z',
        clockTick: 4000,
        dayExpected: 0,
        callsExpected: 4,
      },
      //bi-weekly cases
      {
        name: 'Feb 19 at 4:30 PM, scrapeContestData TO BE called',
        dateString: '2022-02-19T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 3,
      },
      {
        name: 'a day after Feb 19 at 4:30PM, scrapeContestData to NOT BE  called',
        dateString: '2022-02-20T16:30Z',
        clockTick: 3000,
        dayExpected: 0,
        callsExpected: 0,
      },
      {
        name: 'a week after Feb 19 at 4:30PM, scrapeContestData to NOT BE called',
        dateString: '2022-02-26T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 0,
      },
      {
        name: '2 weeks after Feb 19, March 5 at 4:30PM, scrapeContestData TO BE called',
        dateString: '2022-03-05T16:30Z',
        clockTick: 3000,
        dayExpected: 6,
        callsExpected: 3,
      },
      {
        name: 'one minute before, should NOT BE called',
        dateString: '2022-02-19T16:29Z',
        clockTick: 4000,
        dayExpected: 6,
        callsExpected: 0,
      },
      {
        name: 'one minute after, TO HAVE BEEN called',
        dateString: '2022-02-19T16:31Z',
        clockTick: 4000,
        dayExpected: 6,
        callsExpected: 4,
      },
    ];

    test.each(testCases)(
      '$name',
      async ({ dateString, clockTick, dayExpected, callsExpected }) => {
        const service = app.get(TasksService);
        expect(service._called).toBe(0);
        clock = sinon.useFakeTimers({
          now: new Date(dateString).valueOf(),
        });
        await app.init();
        clock.tick(clockTick);
        expect(new Date().getDay()).toBe(dayExpected);
        expect(service._called).toBe(callsExpected);
      },
    );
  });
});
