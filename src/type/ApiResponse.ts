import { Message } from '@/model/user.model';
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // sending api response as success and message, but we dont need isAcceptingMessage in signup or login, so that why optional
  messages?: Array<Message>;
}
