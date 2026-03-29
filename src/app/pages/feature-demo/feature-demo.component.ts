import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-feature-demo',
  imports: [
    TranslateModule,
    CardModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    ChipModule,
    InputTextModule,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ 'APP.DEMO.TITLE' | translate }}</h1>
      <p class="text-surface-500">{{ 'APP.DEMO.SUBTITLE' | translate }}</p>

      <p-card [header]="'APP.DEMO.BUTTONS' | translate">
        <div class="flex flex-wrap gap-3">
          <p-button label="Primary" severity="primary" />
          <p-button label="Secondary" severity="secondary" />
          <p-button label="Success" severity="success" />
          <p-button label="Warning" severity="warn" />
          <p-button label="Danger" severity="danger" />
          <p-button label="Info" severity="info" />
          <p-button label="Outlined" [outlined]="true" />
          <p-button label="Text" [text]="true" />
          <p-button icon="pi pi-check" severity="success" [rounded]="true" />
        </div>
      </p-card>

      <p-card [header]="'APP.DEMO.TAGS_BADGES' | translate">
        <div class="flex flex-wrap gap-3 items-center">
          <p-tag value="Primary" />
          <p-tag value="Success" severity="success" />
          <p-tag value="Warning" severity="warn" />
          <p-tag value="Danger" severity="danger" />
          <p-tag value="Info" severity="info" />
          <p-badge value="4" />
          <p-chip label="Chip" icon="pi pi-user" />
        </div>
      </p-card>

      <p-card [header]="'APP.DEMO.INPUT' | translate">
        <div class="flex flex-col gap-3 max-w-sm">
          <input pInputText [placeholder]="'APP.DEMO.INPUT' | translate" class="w-full" />
        </div>
      </p-card>
    </div>
  `,
})
export class FeatureDemoComponent {}
