import {
  CheckingIcon,
  CompleteIcon,
  CompleteTwiceIcon,
} from '@/components/CustomIcons';

export const PRISONER_RELATIONSHIP_OPTIONS = [
  'family',
  'friend',
  'lawyer',
  'other',
];

export const FAQ_ITEMS = ['howDownload', 'howTrack', 'howRegister'];

export const STATUS_LABELS = {
  PENDING: {
    label: 'Pending',
    type: 'warning',
    icon: CheckingIcon,
  },
  PROCESSED: {
    label: 'processed',
    type: 'info',
    icon: CompleteIcon,
  },
  DELIVERED: {
    label: 'delivered',
    type: 'info',
    icon: CheckingIcon,
  },
  DONE: {
    label: 'done',
    type: 'success',
    icon: CompleteTwiceIcon,
  },
};
