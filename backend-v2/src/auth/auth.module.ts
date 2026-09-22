import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthLibraryVerifier } from './google-auth-library.verifier';
import { GoogleTokenVerifier } from './google-token-verifier.interface';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { TokenService } from './token.service';

@Module({
  controllers: [AuthController],
  imports: [
    CommonModule, // JwtModule (access-token signing) + UsersModule
    UsersModule,
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
  ],
  providers: [
    AuthService,
    TokenService,
    { provide: GoogleTokenVerifier, useClass: GoogleAuthLibraryVerifier },
  ],
})
export class AuthModule {}
