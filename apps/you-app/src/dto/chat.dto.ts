export class GetmessagesDto {
  senderId: string;
  receiverId: string;
}

export class CreateMessageDto {
  messageId: string;
  message: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
}
