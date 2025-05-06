import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

// jwt-refresh.module.ts
@Module({
    imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          secret: config.get<string>('JWT_REFRESH_SECRET'),
          signOptions: { expiresIn: '10d' },
        }),
      }),
    ],
    providers: [
      {
        provide: 'JwtRefreshService',
        useExisting: JwtService,
      },
    ],
    exports: ['JwtRefreshService'],
  })
  export class JwtRefreshModule {}
  