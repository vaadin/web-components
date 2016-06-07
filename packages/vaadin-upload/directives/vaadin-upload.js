System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Polymer, VaadinUpload;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            console.warn('The `VaadinUpload` directive is deprecated. Please use ' +
                '`PolymerElement(\'vaadin-upload\')` from the `@vaadin/angular2-polymer` ' +
                'npm package instead.');
            Polymer = window.Polymer;
            VaadinUpload = (function () {
                function VaadinUpload(el) {
                    this._initialValueSet = false;
                    this.filesChange = new core_1.EventEmitter(false);
                    if (!Polymer || !Polymer.isInstance(el.nativeElement)) {
                        console.error("vaadin-upload has not been imported yet, please remember to import vaadin-upload.html in your main HTML page.");
                        return;
                    }
                    this._element = el.nativeElement;
                    if (!Polymer.Settings.useShadow) {
                        this._element.async(this._observeMutations.bind(this));
                    }
                }
                VaadinUpload.prototype.fileschanged = function () {
                    if (!this._initialValueSet) {
                        this._initialValueSet = true;
                        return;
                    }
                    this.filesChange.emit(this._element.files);
                };
                VaadinUpload.prototype._observeMutations = function () {
                    var _this = this;
                    var lightDom = Polymer.dom(this._element);
                    var observerConfig = { childList: true, subtree: true };
                    // Move all the misplaced nodes to light dom
                    [].slice.call(this._element.childNodes, 0).forEach(function (child) {
                        if (_this._isLightDomChild(child)) {
                            lightDom.appendChild(child);
                        }
                    });
                    // Add a mutation observer for further additions / removals
                    var observer = new MutationObserver(function (mutations) {
                        observer.disconnect();
                        mutations.forEach(function (mutation) {
                            [].forEach.call(mutation.addedNodes, function (added) {
                                if (_this._isLightDomChild(added) && added.parentElement === _this._element) {
                                    lightDom.appendChild(added);
                                }
                            });
                            [].forEach.call(mutation.removedNodes, function (removed) {
                                if (lightDom.children.indexOf(removed) > -1) {
                                    lightDom.removeChild(removed);
                                }
                            });
                        });
                        setTimeout(function () {
                            observer.observe(_this._element, observerConfig);
                        }, 0);
                    });
                    observer.observe(this._element, observerConfig);
                };
                VaadinUpload.prototype._isLightDomChild = function (node) {
                    return !node.tagName || !node.classList.contains('vaadin-upload');
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], VaadinUpload.prototype, "filesChange", void 0);
                __decorate([
                    core_1.HostListener('files-changed'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], VaadinUpload.prototype, "fileschanged", null);
                VaadinUpload = __decorate([
                    core_1.Directive({
                        selector: 'vaadin-upload'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], VaadinUpload);
                return VaadinUpload;
            }());
            exports_1("VaadinUpload", VaadinUpload);
        }
    }
});

//# sourceMappingURL=vaadin-upload.js.map
