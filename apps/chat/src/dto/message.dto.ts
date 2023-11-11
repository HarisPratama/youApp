export class CreateMessageDto {
  messageId: string;
  message: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
}
