import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './dto/task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'someUser',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  id: 'taskId',
  title: 'Some task',
  description: 'Some task description',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  afterEach(() => jest.resetAllMocks());

  describe('.getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('.getTaskById', () => {
    it('calls tasksRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('taskId', mockUser);
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        id: 'taskId',
        user: mockUser,
      });
      expect(result).toEqual(mockTask);
    });

    it('throws an error if no task is found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('taskId', mockUser)).rejects.toThrow(
        new NotFoundException(`Task with id taskId does not exist`),
      );
    });
  });
});
