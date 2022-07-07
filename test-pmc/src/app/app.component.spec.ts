import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent
  let el: DebugElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
      component = fixture.componentInstance
      el = fixture.debugElement
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Angular11Crud'`, () => {
    expect(component.title).toEqual('Angular 11 Crud');
  });

  it('should render nav tag', () => {
    const navtag = el.query(By.css('.navbar-brand'))
    expect(navtag.nativeElement.textContent).toEqual('bezKoder')
  })

  it('should have 2 nav items', () => {
    const navls = el.queryAll(By.css('.nav-link'))
    expect(navls.length).toBeGreaterThan(0, 'Could not find nav link')
    expect(navls[0].nativeElement.textContent).toEqual('Tutorials')
    expect(navls[1].nativeElement.textContent).toEqual('Add')
  })
});
