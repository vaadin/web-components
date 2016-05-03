System.register(['@angular/platform-browser-dynamic', '@angular/core', '../../directives/vaadin-combo-box'], function(exports_1, context_1) {
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
    var platform_browser_dynamic_1, core_1, vaadin_combo_box_1;
    var TestApp;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (vaadin_combo_box_1_1) {
                vaadin_combo_box_1 = vaadin_combo_box_1_1;
            }],
        execute: function() {
            TestApp = (function () {
                function TestApp(e, ref) {
                    this.items = ['foo', 'bar', 'baz'];
                    this.selection = 'foo';
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
                        template: "\n    <vaadin-combo-box [(value)]=\"selection\" required class=\"bound\"></vaadin-combo-box>\n\n    <form #testForm=\"ngForm\">\n      <vaadin-combo-box [items]=\"items\" ngControl=\"selection\" [value]=\"selection\" required [_form]=\"testForm\"></vaadin-combo-box>\n    </form>\n    ",
                        directives: [vaadin_combo_box_1.VaadinComboBox]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef])
                ], TestApp);
                return TestApp;
            }());
            exports_1("TestApp", TestApp);
            document.body.addEventListener('bootstrap', function () {
                platform_browser_dynamic_1.bootstrap(TestApp);
            });
        }
    }
});

//# sourceMappingURL=main.js.map
