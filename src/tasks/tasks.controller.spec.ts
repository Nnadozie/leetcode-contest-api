import { Test } from '@nestjs/testing';
import { ContestParamDto, TasksController } from './tasks.controller';
import { setupServer, SetupServerApi } from 'msw/node';
import { rest } from 'msw';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('TasksController', () => {
  let tasksController: TasksController;
  let app: INestApplication;
  const endpoint = 'https://leetcode.com/contest/api/ranking';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        {
          module: AppModule,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    tasksController = app.get<TasksController>(TasksController);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET contest/:contest_type/:contest_number/:last_page', () => {
    let server: SetupServerApi;

    afterEach(() => {
      server.resetHandlers();
    });

    afterAll(() => {
      server.close();
    });

    test('valid params, should return valid response with 200 OK', async () => {
      const mock = {
        params: {
          contest_type: 'weekly',
          contest_number: 28,
          last_page: 1,
        } as ContestParamDto,
        leetcodeRes: {
          total_rank: [{ finish_time: 1, rank: 1, score: 1 }],
        },
        get controllerRes() {
          return this.leetcodeRes.total_rank;
        },
      };

      server = setupServer(
        rest.get(
          `${endpoint}/${mock.params.contest_type}-contest-${mock.params.contest_number}/`,
          (req, res, ctx) => {
            return res(ctx.json(mock.leetcodeRes));
          },
        ),
      );

      server.listen();

      return request(app.getHttpServer())
        .get(
          `/contest/${mock.params.contest_type}/${mock.params.contest_number}/${mock.params.last_page}`,
        )
        .expect(200)
        .expect(mock.controllerRes);
    });

    test('invalid params, should return error, 400 bad request, invalid params', () => {
      const mock = {
        params: {
          contest_type: 55,
          contest_number: 'a',
          last_page: 'b',
        },
        leetcodeRes: undefined,
        get controllerRes() {
          return {
            statusCode: 400,
            message: [
              'contest_type must be a valid enum value',
              'contest_number must be a number string',
              'last_page must be a number string',
            ],
            error: 'Bad Request',
          };
        },
      };

      server = setupServer(
        rest.get(
          `${endpoint}/${mock.params.contest_type}-contest-${mock.params.contest_number}/`,
          (req, res, ctx) => {
            return res(ctx.json(mock.leetcodeRes));
          },
        ),
      );

      server.listen();

      return request(app.getHttpServer())
        .get(
          `/contest/${mock.params.contest_type}/${mock.params.contest_number}/${mock.params.last_page}`,
        )
        .expect(400)
        .expect(mock.controllerRes);
    });
    test('valid params, but contest does not exist, should return 404 not found', () => {
      const mock = {
        params: {
          contest_type: 'weekly',
          contest_number: 280,
          last_page: 800,
        },
        leetcodeRes: undefined,
        get controllerRes() {
          return {
            status: 404,
            error: 'contest not found',
          };
        },
      };

      server = setupServer(
        rest.get(
          `${endpoint}/${mock.params.contest_type}-contest-${mock.params.contest_number}/`,
          (req, res, ctx) => {
            return res(ctx.status(404), ctx.json({}));
          },
        ),
      );

      server.listen();

      return request(app.getHttpServer())
        .get(
          `/contest/${mock.params.contest_type}/${mock.params.contest_number}/${mock.params.last_page}`,
        )
        .expect(404)
        .expect(mock.controllerRes);
    });
  });
});
