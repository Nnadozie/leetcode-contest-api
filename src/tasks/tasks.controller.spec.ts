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

  describe('weekly', () => {
    test('Feb 13 at 4:30AM, scrapeContestData TO BE called', async () => {
      const service = app.get(TasksService);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-13T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(3000);
      expect(new Date().getDay()).toBe(0);
      expect(service._called).toBe(3);
    });

    test('a day after Feb 13 at 4:30AM, scrapeContestData to NOT BE called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-14T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(2000);
      expect(new Date().getDay()).toBe(1);

      expect(service._called).toBe(0);
    });

    test('a week after Feb 13 at 4:30AM, scrapeContestData TO BE called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-20T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(4000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBe(4);
    });

    test('2 weeks after Feb 13 at 4:30AM, scrapeContestData TO BE called ', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-27T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(4000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBe(4);
    });

    test('one minute before ,should to NOT BE called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-20T04:29Z').valueOf(),
      });
      await app.init();
      clock.tick(4000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBe(0);
    });

    test('one minute after, TO HAVE BEEN called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-20T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(60000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBeGreaterThan(0);
    });

    test('one hour before ,should to NOT BE  be called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-20T03:30Z').valueOf(),
      });
      await app.init();
      clock.tick(4000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBe(0);
    });

    test('one hour after, TO HAVE BEEN called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2022-02-20T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick('01:00:00');
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBeGreaterThan(0);
    });

    test('one year later, TO BE called', async () => {
      const service = app.get(TasksService);
      expect(service._called).toBe(0);
      clock = sinon.useFakeTimers({
        now: new Date('2023-02-19T04:30Z').valueOf(),
      });
      await app.init();
      clock.tick(4000);
      expect(new Date().getDay()).toBe(0);

      expect(service._called).toBe(4);
    });
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
