import { Injectable } from '@nestjs/common';
import { User } from '../entity';
import { UserRepository } from '@infrastructure/repository/user/repository.interface';

@Injectable()
export class UserDomainService {
    constructor(private userRepository: UserRepository) {}

    async checkDuplicate(user: User): Promise<void> {
        const queryBuilder = await this.userRepository.getQueryBuilder();
        queryBuilder.userId.equals(user.userId);
        const found = await this.userRepository.findOne(queryBuilder);
        if (found !== null) throw new Error();
    }
}
