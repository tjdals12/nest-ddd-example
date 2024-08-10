import { Test } from '@nestjs/testing';
import { UserDomainService } from './user-domain.service';
import { UserRepository } from '@infrastructure/repository/user/repository.interface';
import { userRepository } from '@infrastructure/repository/user/__mock__';
import { User } from '../entity';

describe('UserDomainService', () => {
    let userDomainService: UserDomainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserDomainService],
        })
            .useMocker((token) => {
                if (token === UserRepository) {
                    return userRepository;
                }
            })
            .compile();
        userDomainService = moduleRef.get<UserDomainService>(UserDomainService);
    });

    const user = new User({
        type: 'create',
        userId: 'test',
        password: 'test1234!',
        userName: 'another',
        isEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    describe('checkDuplicate', () => {
        it('중복될 경우 예외를 발생시켜야 한다.', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            await expect(
                userDomainService.checkDuplicate(user),
            ).rejects.toThrow();
        });
        it('중복되지 않을 경우 예외를 발생시키지 않아야 한다.', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            await expect(
                userDomainService.checkDuplicate(user),
            ).resolves.not.toThrow();
        });
    });
});
