import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class EntityService<
    EntityModel, 
    CreateDto extends DeepPartial<EntityModel>, 
    UpdateDto extends QueryDeepPartialEntity<EntityModel>
    > {
    constructor(
        private readonly repository: Repository<EntityModel>,
        private readonly entityModelName: string
    ) {}

    async create(createDto: CreateDto) {
        try {
          const entity = this.repository.create(createDto);
          return await this.repository.save(entity);
        } catch (error) {
          throw new InternalServerErrorException(`Error creating entity: ${error.message}`);
        }
      }
    
      find(): SelectQueryBuilder<EntityModel> {
        return this.repository.createQueryBuilder(this.entityModelName);
      }
    
      async update(id: any, updateDto: UpdateDto): Promise<EntityModel> {
        try {
          await this.repository.update(id, updateDto);
          return await this.repository.findOne(id);
        } catch (error) {
          throw new InternalServerErrorException(`Error updating entity: ${error.message}`);
        }
      }
    
      async remove(id: number) {
        try {
          await this.repository.delete(id);
        } catch (error) {
          throw new InternalServerErrorException(`Error removing entity: ${error.message}`);
        }
      }
}
