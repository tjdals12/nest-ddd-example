import { User } from './user-domain.entity';

describe('UserEntity', () => {
    const userId = 'test';
    const password = 'test1234!';
    const userName = 'test';

    describe('Instantiate', () => {
        it('아이디(userId)는 영어 소문자와 숫자만 사용할 수 있다.', () => {
            const wrongUserId1 = 'Test';
            const rightUserId1 = 'test';
            const rightUserId2 = 'test12';
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: wrongUserId1,
                        password,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: rightUserId1,
                        password,
                        userName,
                    }),
            ).not.toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: rightUserId2,
                        password,
                        userName,
                    }),
            ).not.toThrow();
        });
        it('아이디(userId)는 숫자만 사용할 수 없다.', () => {
            const wrongUserId = '1234';
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: wrongUserId,
                        password,
                        userName,
                    }),
            ).toThrow();
        });
        it('아이디(userId)는 3글자 이상, 16글자 이하이어야 한다.', () => {
            const wrongUserId1 = 'a2';
            const wrongUserId2 = 'a' + '1'.repeat(16);
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: wrongUserId1,
                        password,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId: wrongUserId2,
                        password,
                        userName,
                    }),
            ).toThrow();
        });
        it('비밀번호(password)는 영어, 숫자, 특수문자($@$!%*#?&)만 사용할 수 있다', () => {
            const wrongPassword1 = 'abcd12345_!';
            const wrongPassword2 = '가나다라마바123!';
            const wrongPassword3 = 'ab casd123!';
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword1,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword2,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword3,
                        userName,
                    }),
            ).toThrow();
        });
        it('비밀번호(password)는 영어, 숫자, 특수문자 각각 1 글자 이상을 포함해야 한다.', () => {
            const wrongPassword1 = '123456790';
            const wrongPassword2 = 'aAsd123412';
            const wrongPassword3 = 'asdAwa!asd';
            const wrongPassword4 = '123412312!';
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword1,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword2,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword3,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword4,
                        userName,
                    }),
            ).toThrow();
        });
        it('비밀번호(password)는 8글자 이상, 30글자 이하이어야 한다.', () => {
            const wrongPassword1 = 'asd12!';
            const wrongPassword2 = 'asd12!' + 'a'.repeat(25);
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword1,
                        userName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password: wrongPassword2,
                        userName,
                    }),
            ).toThrow();
        });
        it('유저 이름(userName)은 영어, 한글만 사용할 수 있다.', () => {
            const wrongUserName1 = 'smith!';
            const wrongUserName2 = '홍길동123';
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName2,
                    }),
            ).toThrow();
        });
        it('유저 이름(userName)은 3글자 이상, 20글자 이하이어여 한다.', () => {
            const wrongUserName1 = 'li';
            const wrongUserName2 = '홍길';
            const wrongUserName3 = 'a' + 'b'.repeat(20);
            const wrongUserName4 = '홍' + '길'.repeat(20);
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName2,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName3,
                    }),
            ).toThrow();
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName: wrongUserName4,
                    }),
            ).toThrow();
        });
        it('값이 올바르다면 엔티티를 생성해야 한다.', () => {
            expect(
                () =>
                    new User({
                        type: 'create',
                        userId,
                        password,
                        userName,
                    }),
            ).not.toThrow();
        });
        it('비밀번호는 암호화 해야 한다.', () => {
            const entity = new User({
                type: 'create',
                userId,
                password,
                userName,
            });
            expect(entity.password).not.toEqual(password);
        });
        it('비밀번호가 일치하지 않으면 예외를 발생시켜야 한다.', () => {
            const rightPassword = password;
            const wrongPassword = 'wrongpassword';
            const entity = new User({
                type: 'create',
                userId,
                password,
                userName,
            });
            expect(() => entity.checkPassword(rightPassword)).not.toThrow();
            expect(() => entity.checkPassword(wrongPassword)).toThrow();
        });
    });
});
