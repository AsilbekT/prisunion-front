export interface IPrisonerContactForm {
  firstName: string;
  lastName: string;
  address: string;
}

export interface IPrisonerForm {
  prisonerFirstName: string;
  prisonerLastName: string;
  prisonerRelationship: string;
}

export interface ITokenPairs {
  access: string;
  refresh: string;
}

export interface IPrisonerContact {
  id: number;
  picture: string | null;
  prisoner_full_name: string;
  full_name: string;
  relationship: string;
  phone_verified: boolean;
  prisoner: null | number;
  phone_number: string;
  address: string;
  additional_info: string;
  is_approved: boolean;
  push_notification_user_id: null | number;
  user: number;
}
