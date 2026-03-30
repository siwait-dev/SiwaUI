export interface AppConfigDto {
  appName: string;
  idleTimeoutEnabled: boolean;
  idleTimeoutMinutes: number;
}

export interface AppSettingsFeedback {
  kind: 'saved' | 'save-failed';
}
