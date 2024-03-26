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
  Pending: {
    label: 'Pending',
    type: 'warning',
    icon: CheckingIcon,
  },
  processed: {
    label: 'processed',
    type: 'info',
    icon: CompleteIcon,
  },
  delivered: {
    label: 'delivered',
    type: 'info',
    icon: CheckingIcon,
  },
  done: {
    label: 'done',
    type: 'success',
    icon: CompleteTwiceIcon,
  },
};
