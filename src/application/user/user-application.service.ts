import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/request.dto';
import { UserRepository } from '@infrastructure/repository/user/repository.interface';
import { UserDomainFactory } from '@domain/user/factory';
import { UserDomainService } from '@domain/user/service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProfileDto } from './dto/response.dto';

type AuthResult = {
    accessToken: string;
    refreshToken: string;
};

type AuthRefreshResult = Omit<AuthResult, 'refreshToken'> &
    Partial<Pick<AuthResult, 'refreshToken'>>;

@Injectable()
export class UserApplicationService {
    private readonly accessTokenExpiration = 3600; // 1h
    private readonly refreshTokenExpiration = 604800; // 7d

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private jwtService: JwtService,
        private userDomainFactory: UserDomainFactory,
        private userDomainService: UserDomainService,
        private userRepository: UserRepository,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<void> {
        let user = null;
        try {
            user = this.userDomainFactory.create(signUpDto);
            await this.userDomainService.checkDuplicate(user);
        } catch {
            throw new BadRequestException();
        }
        try {
            await this.userRepository.save(user);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async signIn(signInDto: SignInDto): Promise<AuthResult> {
        const queryBuilder = await this.userRepository.getQueryBuilder();
        queryBuilder.userId.equals(signInDto.userId);
        const user = await this.userRepository.findOne(queryBuilder);
        if (user === null) throw new NotFoundException();
        try {
            const { password } = signInDto;
            user.checkPassword(password);
        } catch {
            throw new BadRequestException();
        }
        const payload = { sub: user.userId, name: user.userName };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenExpiration,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.refreshTokenExpiration,
        });
        await this.cacheManager.set(
            `refreshToken:${payload.sub}`,
            refreshToken,
            { ttl: this.refreshTokenExpiration } as any,
        );
        return { accessToken, refreshToken };
    }

    async signOut(profileDto: ProfileDto): Promise<void> {
        await this.cacheManager.del(`refreshToken:${profileDto.userId}`);
    }

    async refresh(refreshToken: string): Promise<AuthRefreshResult> {
        if (refreshToken === null || refreshToken === undefined)
            throw new UnauthorizedException();

        const { iat, exp, ...payload } = this.jwtService.decode(refreshToken);
        const remainSeconds = Date.now() / 1000 - exp;
        if (0 >= remainSeconds) throw new UnauthorizedException();

        const cachedRefreshToken = await this.cacheManager.get(
            `refreshToken:${payload.sub}`,
        );
        if (refreshToken !== cachedRefreshToken)
            throw new UnauthorizedException();

        const newAccessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenExpiration,
        });

        const halfTotalSeconds = (exp - iat) / 2;
        if (halfTotalSeconds >= remainSeconds) {
            const newRefreshToken = this.jwtService.sign(payload, {
                expiresIn: this.refreshTokenExpiration,
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        return {
            accessToken: newAccessToken,
        };
    }

    async update(
        userId: string,
        updateProfileDto: UpdateProfileDto,
    ): Promise<ProfileDto> {
        const queryBuilder = this.userRepository.getQueryBuilder();
        queryBuilder.userId.equals(userId);
        const user = await this.userRepository.findOne(queryBuilder);
        if (user === null) throw new NotFoundException();
        try {
            user.update(updateProfileDto);
        } catch {
            throw new BadRequestException();
        }
        try {
            await this.userRepository.update(user);
        } catch {
            throw new InternalServerErrorException();
        }
        const profileDto = new ProfileDto(user);
        return profileDto;
    }
}
