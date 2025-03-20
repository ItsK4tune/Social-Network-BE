import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { FollowModule } from '../follow/follow.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './conversation.repository';
import { ProfileModule } from '../profile/profile.module';
import { MemberModule } from '../conversation_member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    MemberModule,
    FollowModule,
    ProfileModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationService],
})
export class ConversationModule {}
