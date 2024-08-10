import { Injectable } from '@nestjs/common';
import { User, UserProperty } from '../entity';
import { UserDomainService } from '../service/user-domain.service';

@Injectable()
export class UserDomainFactory {
    constructor(private userDomainService: UserDomainService) {}

    create(args: Pick<UserProperty, 'userId' | 'password' | 'userName'>): User {
        const { userId, password, userName } = args;
        const user = new User({
            type: 'create',
            userId: userId,
            password: password,
            userName: userName,
            isEnabled: false,
        });
        return user;
    }
}
