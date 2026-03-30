import { UserInfo } from '../../auth/auth.service';

export interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};
