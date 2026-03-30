export interface ProfileData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface ProfileFeedback {
  kind: 'saved' | 'save-failed' | 'load-failed';
}
