import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from './department.entity';
import { DeleteResult } from 'typeorm';
import { HasPermission } from '../permission/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('departments')
export class DepartmentController {
  private readonly service: DepartmentService;

  public constructor(service: DepartmentService) {
    this.service = service;
  }

  @Get()
  @HasPermission("view_departments")
  public async getAll(
    @Query("ordering") ordering: "ASC"| "DESC",
    @Query("search") search: string,
    @Query("all") all = false, 
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ): Promise<any> {
    if (all) return await this.service.find();
    return await this.service.paginate(ordering, search, page, limit);
  }

  @Post()
  @HasPermission("edit_departments")
  public async create(@Body() body: any): Promise<Department> {
    return this.service.create(body);
  }

  @Get(":id")
  @HasPermission("view_departments")
  public async get(@Param("id") id: number): Promise<Department> {
    return await this.service.findOne({
      where: {
        id: id
      }
    });
  }

  @Put(":id")
  @HasPermission("edit_departments")
  public async update(@Param("id") id: number, @Body() body: any): Promise<Department> {
    await this.service.update(id, body);

    return await this.service.findOne({
      where: {
        id: id
      }
    });
  }

  @Delete(":id")
  @HasPermission("edit_departments")
  public async delete(@Param("id") id: number): Promise<DeleteResult> {
    return await this.service.delete(id);
  }
}
