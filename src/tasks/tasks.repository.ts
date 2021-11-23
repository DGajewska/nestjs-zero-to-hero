import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './dto/task-status.enum';
import { Task } from './dto/task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.create({
      status: TaskStatus.OPEN,
      ...createTaskDto,
    });

    return this.save(task);
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.where('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
