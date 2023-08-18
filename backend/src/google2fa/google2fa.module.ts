import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { Google2faController } from './google2fa.controller';
import { Google2faService } from './google2fa.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
    imports: [],
    controllers: [Google2faController],
    providers: [Google2faService]
})

export class Google2faModule { }