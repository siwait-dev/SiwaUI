import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiwaUi } from './siwa-ui';

describe('SiwaUi', () => {
  let component: SiwaUi;
  let fixture: ComponentFixture<SiwaUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiwaUi],
    }).compileComponents();

    fixture = TestBed.createComponent(SiwaUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
