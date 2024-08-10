import * as bcrypt from 'bcrypt';

export type UserProperty = {
    type: 'create' | 'restore';
    userId: string;
    password: string;
    userName: string;
    isEnabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export class User {
    private _userId: string;
    get userId() {
        return this._userId;
    }
    private _password: string;
    get password() {
        return this._password;
    }
    private _userName: string;
    get userName() {
        return this._userName;
    }
    private _isEnabled: boolean;
    get isEnabled() {
        return this._isEnabled;
    }
    private _createdAt: Date;
    get createdAt() {
        return this._createdAt;
    }
    private _updatedAt: Date;
    get updatedAt() {
        return this._updatedAt;
    }
    constructor(args: UserProperty) {
        const {
            type,
            userId,
            password,
            userName,
            isEnabled,
            createdAt,
            updatedAt,
        } = args;
        if (type === 'create') {
            if (this.validateUserId(userId) === false)
                throw new Error('Invalid userId');
            if (this.validatePassword(password) === false)
                throw new Error('Invalid password');
            if (this.validateUserName(userName) === false)
                throw new Error('Invalid userName');
            this._password = this.encryptPassword(password);
            this._isEnabled = false;
        } else if (type === 'restore') {
            this._password = password;
            this._isEnabled = isEnabled;
            this._createdAt = createdAt;
            this._updatedAt = updatedAt;
        }
        this._userId = userId;
        this._userName = userName;
    }
    private validateUserId(userId: string): boolean {
        if (userId === null || userId === undefined) return false;
        const regex = /^(?=.*[a-z])[a-z0-9]{3,16}$/g;
        return regex.test(userId);
    }
    private validatePassword(password: string): boolean {
        if (password === null || password === undefined) return false;
        const regex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*#?&])[a-zA-Z\d$@$!%*#?&]{8,30}$/g;
        return regex.test(password);
    }
    private validateUserName(userName: string): boolean {
        if (userName === null || userName === undefined) return false;
        const regex = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{3,20}$/g;
        return regex.test(userName);
    }
    private encryptPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
    checkPassword(inputPassword: string): void {
        const result = bcrypt.compareSync(inputPassword, this._password);
        if (result === false) throw new Error('Not match password');
    }
    update(args: Partial<Pick<User, 'password' | 'userName' | 'isEnabled'>>) {
        const { password, userName, isEnabled } = args;
        if (password !== undefined) {
            if (this.validatePassword(password) === false)
                throw new Error('Invalid password');
            this._password = this.encryptPassword(password);
        }
        if (userName !== undefined) {
            if (this.validateUserName(userName) === false)
                throw new Error('Invalid userName');
            this._userName = userName;
        }
        if (isEnabled !== undefined) {
            this._isEnabled = isEnabled;
        }
    }
}
