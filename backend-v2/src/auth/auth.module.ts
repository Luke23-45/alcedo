import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthLibraryVerifier } from './google-auth-library.verifier';
import { GoogleTokenVerifier } from './google-token-verifier.interface';
import { TokenService } from './token.service';

// The RefreshTokenRepository binding is owned by the global
// PersistenceModule — this module injects the token directly.

@Module({
  controllers: [AuthController],
  imports: [
    CommonModule, // JwtModule (access-token signing) + UsersModule
    UsersModule,
  ],
  providers: [
    AuthService,
    TokenService,
    { provide: GoogleTokenVerifier, useClass: GoogleAuthLibraryVerifier },
  ],
})
export class AuthModule {}
