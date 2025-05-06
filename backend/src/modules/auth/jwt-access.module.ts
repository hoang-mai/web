import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'JwtAccessService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtAccessService',],
})
export class JwtAccessModule {}
