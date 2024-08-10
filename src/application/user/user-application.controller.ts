import {
    Controller,
    Body,
    Get,
    Post,
    HttpStatus,
    Res,
    Patch,
    HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserApplicationService } from './user-application.service';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/request.dto';
import { Cookies, Public, User } from './auth.decorator';
import { ProfileDto } from './dto/response.dto';
import {
    ApiBadRequestException,
    ApiBaseResponse,
    ApiNotFoundException,
    ApiUnauthorizedException,
} from 'src/core/controller.decorator';

@ApiTags('User')
@Controller({
    version: '1',
    path: 'users',
})
export class UserApplicationController {
    constructor(private userApplicationService: UserApplicationService) {}

    @Public()
    @Post('sign-up')
    @ApiOperation({ summary: '계정 추가', description: '계정 추가' })
    @ApiBaseResponse({ status: HttpStatus.CREATED })
    @ApiBadRequestException()
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.userApplicationService.signUp(signUpDto);
    }

    @Public()
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그인', description: '로그인' })
    @ApiBaseResponse({ status: HttpStatus.OK })
    @ApiBadRequestException()
    @ApiUnauthorizedException()
    async signIn(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.userApplicationService.signIn(signInDto);
        res.header('x-access-token', accessToken)
            .cookie('x-refresh-token', refreshToken, {
                secure: true,
                httpOnly: true,
            })
            .status(HttpStatus.OK);
    }

    @Post('sign-out')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그아웃', description: '로그아웃' })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK })
    @ApiUnauthorizedException()
    async signOut(@User() user: ProfileDto) {
        await this.userApplicationService.signOut(user);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그인 연장', description: '로그인 연장' })
    @ApiBaseResponse({ status: HttpStatus.OK })
    @ApiUnauthorizedException()
    async refresh(
        @Cookies('x-refresh-token') refreshToken,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await this.userApplicationService.refresh(refreshToken);
        res.header('x-access-token', newAccessToken);
        if (newRefreshToken) {
            res.cookie('x-refresh-token', newRefreshToken, {
                secure: true,
                httpOnly: true,
            });
        }
    }

    @Get('profile')
    @ApiOperation({ summary: '프로필 조회', description: '프로필 조회' })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK, type: ProfileDto })
    @ApiUnauthorizedException()
    async profile(@User() user: ProfileDto) {
        return user;
    }

    @Patch('/profile')
    @ApiOperation({ summary: '프로필 수정', description: '프로필 수정' })
    @ApiBearerAuth()
    @ApiBaseResponse({ status: HttpStatus.OK, type: ProfileDto })
    @ApiUnauthorizedException()
    @ApiNotFoundException()
    async update(
        @User() user: ProfileDto,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.userApplicationService.update(
            user.userId,
            updateProfileDto,
        );
    }
}
