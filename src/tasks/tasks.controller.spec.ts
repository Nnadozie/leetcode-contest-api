import { INestApplication } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

const TasksServiceMock = {
  scrapeContestData: jest.fn().mockImplementation(() => {
    console.log('called mock scrape');
  }),
};

describe('TasksService', () => {
  let tasksService: TasksService;

  // beforeEach(async () => {
  //   const moduleRef: TestingModule = await Test.createTestingModule({
  //     providers: [
  // {
  //   provide: TasksService,
  //   useValue: TasksServiceMock,
  // },
  //     ],
  //   }).compile();

  //   tasksService = moduleRef.get<TasksService>(TasksService);
  // });

  let app: INestApplication;

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
    //tasksService = module.get<TasksService>(TasksService);
  });

  describe('weekly', () => {
    it(`should schedule "cron"`, async () => {
      const service = app.get(TasksService);

      //expect(tasksService.scrapeContestData).not.toHaveBeenCalled();

      await app.init();
      await new Promise((r) => setTimeout(r, 2000));

      expect(service._called).toBe(2);
    });
    test('Feb 13 at 4:30AM, scrapeContestData TO BE called', async () => {
      //const service = app.get(TasksService);
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date('2022-02-13T04:30Z').valueOf());
      await new Promise((r) => setTimeout(r, 2000));

      //expect(tasksService.scrapeContestData).toHaveBeenCalled();
    });

    test.todo(
      'a day after Feb 13 at 4:30AM, scrapeContestData to NOT BE called ',
    );

    test.todo('a week after Feb 13 at 4:30AM, scrapeContestData TO BE called');

    test.todo(
      '2 weeks after Feb 13 at 4:30AM, scrapeContestData TO BE called ',
    );

    test.todo('one minute before ,should to NOT BE  be called');

    test.todo('one minute after, TO BE called');

    test.todo('one hour before ,should to NOT BE  be called');

    test.todo('one hour after, TO BE called');

    test.todo('one year later, TO BE called');
  });

  describe('biweekly', () => {
    test.todo('Feb 19 at 4:30 PM, scrapeContestData TO BE called');

    test.todo(
      'a day after Feb 19 at 4:30PM, scrapeContestData to NOT BE  called ',
    );

    test.todo('a week after Feb 19 at 4:30PM, scrapeContestData TO BE called');

    test.todo(
      '2 weeks after Feb 19 at 4:30PM, scrapeContestData TO BE called ',
    );

    test.todo('one minute before ,should to NOT BE  be called');

    test.todo('one minute after, TO BE called');

    test.todo('one hour before ,should to NOT BE  be called');

    test.todo('one hour after, TO BE called');
  });
});
