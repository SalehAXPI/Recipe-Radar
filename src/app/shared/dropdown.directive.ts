import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({ standalone: true, selector: '[appDropdown]' })
export class DropdownDirective implements OnInit {
  private shown: boolean = false;
  private dropDownMenu!: HTMLUListElement;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.dropDownMenu = this.elRef.nativeElement.nextElementSibling;
  }

  @HostListener('document:click', ['$event']) mouseClick(event: Event) {
    const isClickedOnDropDown = this.elRef.nativeElement.contains(event.target);
    this.shown = isClickedOnDropDown ? !this.shown : false;
    this.renderer[this.shown ? 'addClass' : 'removeClass'](
      this.dropDownMenu,
      'show'
    );
  }
}
