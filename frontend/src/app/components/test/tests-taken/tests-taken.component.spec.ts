import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsTakenComponent } from './tests-taken.component';

describe('TestsTakenComponent', () => {
  let component: TestsTakenComponent;
  let fixture: ComponentFixture<TestsTakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsTakenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
