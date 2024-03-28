export interface INotification {
  id: number;
  recipient: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}
