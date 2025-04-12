import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInstructionsComponent } from './test-instructions.component';

describe('TestInstructionsComponent', () => {
  let component: TestInstructionsComponent;
  let fixture: ComponentFixture<TestInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
