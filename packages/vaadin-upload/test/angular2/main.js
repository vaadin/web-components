System.register(['angular2/platform/browser', 'angular2/core', '../../directives/vaadin-upload'], function(exports_1, context_1) {
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
    var browser_1, core_1, vaadin_upload_1;
    var TestApp;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (vaadin_upload_1_1) {
                vaadin_upload_1 = vaadin_upload_1_1;
            }],
        execute: function() {
            TestApp = (function () {
                function TestApp(e, ref) {
                    this.visible = false;
                    this.files = [];
                    this._host = e.nativeElement;
                    this._ref = ref;
                }
                TestApp.prototype.ngAfterViewInit = function () {
                    var event = new CustomEvent('readyForTests', { detail: this });
                    this._host.dispatchEvent(event);
                };
                TestApp.prototype.detectChanges = function () {
                    this._ref.detectChanges();
                };
                TestApp = __decorate([
                    core_1.Component({
                        selector: 'test-app',
                        template: "\n    <form>\n      <vaadin-upload [(files)]=\"files\" ngControl=\"upload\" required>Text content</vaadin-upload>\n    </form>\n    <vaadin-upload id=\"structural\">\n      <div class=\"drop-label\">\n        <span *ngIf=\"visible\">Content for drop-label</span>\n      </div>\n      <div class=\"file-list\">\n        <span *ngIf=\"visible\">Content for file-list</span>\n      </div>\n    </vaadin-upload>\n    ",
                        directives: [vaadin_upload_1.VaadinUpload]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef])
                ], TestApp);
                return TestApp;
            }());
            exports_1("TestApp", TestApp);
            document.body.addEventListener('bootstrap', function () {
                browser_1.bootstrap(TestApp);
            });
        }
    }
});

//# sourceMappingURL=main.js.map
