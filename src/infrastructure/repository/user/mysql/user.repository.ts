import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository.interface';
import { User as UserEntity } from '@domain/user/entity';
import { User as UserModel } from './user.model';
import { MysqlUserQueryBuilder } from './user.query-builder';
import { QueryBuilder } from '../query-builder.interface';

@Injectable()
export class MysqlUserRepository extends UserRepository {
    getQueryBuilder(): QueryBuilder {
        return new MysqlUserQueryBuilder();
    }
    async findOne(queryBuilder: MysqlUserQueryBuilder): Promise<UserEntity> {
        const queryCondition = queryBuilder.build();
        const model = await UserModel.findOneBy(queryCondition);
        if (model === null) return null;
        return this.toEntity(model);
    }
    async save(entity: UserEntity): Promise<void> {
        await UserModel.insert({
            userId: entity.userId,
            password: entity.password,
            userName: entity.userName,
            isEnabled: entity.isEnabled,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
    async update(entity: UserEntity): Promise<void> {
        await UserModel.update(
            { userId: entity.userId },
            {
                password: entity.password,
                userName: entity.userName,
                isEnabled: entity.isEnabled,
            },
        );
    }
    private toEntity(model: UserModel) {
        const entity = new UserEntity({
            type: 'restore',
            userId: model.userId,
            password: model.password,
            userName: model.userName,
            isEnabled: model.isEnabled,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        });
        return entity;
    }
}
