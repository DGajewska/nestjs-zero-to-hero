import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
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
}
