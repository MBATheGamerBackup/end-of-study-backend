import { Injectable } from '@nestjs/common';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../common/abstract.service';
import { PaginateResult } from '../common/paginate-result.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends AbstractService<User> {
  public constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  public async paginate(page = 1, take = 15, relations = []): Promise<PaginateResult<User>> {
    const {data, meta} = await super.paginate(page, take, relations);

    return {
      data: data.map(user => {
        const {password, ...data} = user;
        return data;
      }),
      meta: meta
    }
  }
  
  public async paginateBySort(field: string, order: "ASC" | "DESC", page = 1, take = 15, relations = []) {
    const {data, meta} = await super.paginateBySort(field, order, page, take, relations);

    const users = [];

    for (let user of data) {
      users.push(await this.findOne({
          where: {
            id: user.id
          },
        }, relations)
      )
    }

    return {
      data: users.map(user => {
        const {password, ...data} = user;
        return data;
      }),
      meta: meta
    }
  }

  public async paginateBySearch(keyword: string, field: string, page = 1, take = 15, relations = []): Promise<PaginateResult<User>>  {
    const {data, meta} = await super.paginateBySearch(keyword, field, page, take);

    const users: User[] = [];

    for (let user of data) {
      users.push(await this.findOne({
          where: {
            id: user.id
          },
        }, relations)
      );
    }

    return {
      data: users.map((user) => {
        const {password, ...data} = user;
        return data;
      }),
      meta: meta
    }
  }

  public async findByRole(roleId: number, relations = []): Promise<User[]> {
    let users = await super.find(relations);
    return users.filter(user => user.role.id === roleId);
  }
}
