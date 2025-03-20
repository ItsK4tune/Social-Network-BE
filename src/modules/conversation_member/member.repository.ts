// import { InjectRepository } from '@nestjs/typeorm';
// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { Member } from './entities/member.entity';

// @Injectable()
// export class MemberRepository {
//   constructor(
//     @InjectRepository(Member)
//     private readonly repo: Repository<Member>,
//   ) {}

//   async save(member: Member) {
//     return this.repo.save(member);
//   }

//   async updateType(id: number, type: string) {
//     return this.repo.update(id, { type });
//   }

//   async getMemberByConversationIdAndUserId(
//     conversationId: number,
//     userUserId: number,
//   ) {
//     return this.repo.findOne({
//       where: { conversationId, userUserId },
//     });
//   }

//   async getMembersByConversationID(conversationId: number, type: string) {
//     return this.repo.find({ where: { conversationId, type } });
//   }

//   async getMembersByUserId(userUserId: number, type: string) {
//     return this.repo.find({ where: { userUserId, type } });
//   }

//   async getMemberById(id: number) {
//     return this.repo.findOne({ where: { id } });
//   }
// }
