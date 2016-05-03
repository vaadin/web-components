import {
  Directive,
  ElementRef,
  Output,
  HostListener,
  EventEmitter
} from '@angular/core';
declare var Polymer;

@Directive({
  selector: 'vaadin-upload'
})
export class VaadinUpload {

  private _element;
  private _initialValueSet = false;

  @Output() filesChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('files-changed')
  fileschanged() {
    if (!this._initialValueSet) {
      this._initialValueSet = true;
      return;
    }

    this.filesChange.emit(this._element.files);
  }

  constructor(el: ElementRef) {
    if (!(<any>window).Polymer || !Polymer.isInstance(el.nativeElement)) {
      console.error("vaadin-upload has not been imported yet, please remember to import vaadin-upload.html in your main HTML page.");
      return;
    }

    this._element = el.nativeElement;

    if (!Polymer.Settings.useShadow) {
      this._element.async(this._observeMutations.bind(this));
    }
  }

  _observeMutations() {
    const lightDom = Polymer.dom(this._element);
    const observerConfig = { childList: true, subtree: true };

    // Move all the misplaced nodes to light dom
    [].slice.call(this._element.childNodes, 0).forEach((child) => {
      if (this._isLightDomChild(child)) {
        lightDom.appendChild(child);
      }
    });

    // Add a mutation observer for further additions / removals
    const observer = new MutationObserver((mutations) => {
      observer.disconnect();

      mutations.forEach((mutation) => {
        [].forEach.call(mutation.addedNodes, (added) => {
          if (this._isLightDomChild(added) && added.parentElement === this._element) {
            lightDom.appendChild(added);
          }
        });

        [].forEach.call(mutation.removedNodes, (removed) => {
          if (lightDom.children.indexOf(removed) > -1) {
            lightDom.removeChild(removed);
          }
        });
      });

      setTimeout(() => {
        observer.observe(this._element, observerConfig);
      }, 0);
    });

    observer.observe(this._element, observerConfig);
  }

  _isLightDomChild(node) {
    return !node.tagName || !node.classList.contains('vaadin-upload');
  }
}
