import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

const TasksServiceMock = {
  scrapeContestData: jest.fn().mockImplementation(() => {
    console.log('called mock scrape');
  }),

  handleTimeout: jest.fn().mockImplementation(() => {
    console.log('called mock scrape');
  }),
};

describe('TasksService', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksService,
          useValue: TasksServiceMock,
        },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
  });

  describe('weekly', () => {
    test('Feb 13 at 4:30AM, scrapeContestData TO BE called', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date('2022-02-13T04:30Z').valueOf());
      await new Promise((r) => setTimeout(r, 2000));

      expect(tasksService.scrapeContestData).toHaveBeenCalled();
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
