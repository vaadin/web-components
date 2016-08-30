System.register(['@angular/core', '@angular/forms'], function(exports_1, context_1) {
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
    var core_1, forms_1;
    var TestApp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }],
        execute: function() {
            TestApp = (function () {
                function TestApp(e, ref) {
                    this.boundDate = '2000-01-01';
                    this.date = '2000-01-01';
                    this._host = e.nativeElement;
                    this._ref = ref;
                    this.form = new forms_1.FormGroup({
                        date: new forms_1.FormControl()
                    });
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
                        template: "\n    <vaadin-date-picker [(value)]=\"boundDate\" required class=\"bound\"></vaadin-date-picker>\n\n    <form [formGroup]=\"form\">\n      <vaadin-date-picker formControlName=\"date\" [(value)]=\"date\" required></vaadin-date-picker>\n    </form>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef])
                ], TestApp);
                return TestApp;
            }());
            exports_1("TestApp", TestApp);
        }
    }
});

//# sourceMappingURL=app.component.js.map
