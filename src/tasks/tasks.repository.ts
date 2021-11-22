import { EntityRepository, Repository } from 'typeorm';
import { Task } from './dto/task.entity';

@EntityRepository()
export class TaskRepository extends Repository<Task> {}
