import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, CardModule, ButtonModule, InputTextModule, AvatarModule],
  template: `
    <div class="flex flex-col gap-6 max-w-2xl">
      <h1 class="text-2xl font-bold">{{ 'PROFILE.TITLE' | translate }}</h1>

      <p-card>
        <div class="flex items-center gap-4 mb-6">
          <p-avatar icon="pi pi-user" size="xlarge" shape="circle" />
          <div>
            <h2 class="text-lg font-semibold">Display name</h2>
            <p class="text-surface-500 text-sm">user&#64;example.com</p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-medium">{{ 'PROFILE.FIRST_NAME' | translate }}</label>
            <input pInputText class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-medium">{{ 'PROFILE.LAST_NAME' | translate }}</label>
            <input pInputText class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-medium">{{ 'COMMON.EMAIL' | translate }}</label>
            <input pInputText type="email" class="w-full" [attr.readonly]="true" />
          </div>
          <p-button [label]="'PROFILE.SAVE' | translate" severity="primary" icon="pi pi-save" />
        </div>
      </p-card>
    </div>
  `,
})
export class ProfileComponent {}
