import { User } from '@domain/user/entity';

export class ProfileDto {
    userId: string;
    userName: string;
    constructor(entity: User) {
        this.userId = entity.userId;
        this.userName = entity.userName;
    }
}
