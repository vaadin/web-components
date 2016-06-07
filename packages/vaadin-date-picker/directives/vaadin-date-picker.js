System.register(['@angular/core', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var Polymer, VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR, VaadinDatePicker;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            console.warn('The `VaadinDatePicker` directive is deprecated. Please use ' +
                '`PolymerElement(\'vaadin-date-picker\')` from the ' +
                '`@vaadin/angular2-polymer` npm package instead.');
            Polymer = window.Polymer;
            VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR = new core_1.Provider(common_1.NG_VALUE_ACCESSOR, {
                useExisting: core_1.forwardRef(function () { return VaadinDatePicker; }),
                multi: true
            });
            VaadinDatePicker = (function () {
                function VaadinDatePicker(renderer, el, _injector) {
                    var _this = this;
                    this._injector = _injector;
                    this._initialValueSet = false;
                    this.onChange = function (_) { };
                    this.onTouched = function () { };
                    this.valueChange = new core_1.EventEmitter(false);
                    if (!Polymer || !Polymer.isInstance(el.nativeElement)) {
                        console.error("vaadin-date-picker has not been imported yet, please remember to import vaadin-date-picker.html in your main HTML page.");
                        return;
                    }
                    this._renderer = renderer;
                    this._element = el.nativeElement;
                    this._element.$$('paper-input-container').addEventListener('blur', function () {
                        if (!_this._element.opened && !_this._element._opened) {
                            _this.onTouched();
                        }
                    });
                }
                VaadinDatePicker.prototype.writeValue = function (value) {
                    this._renderer.setElementProperty(this._element, 'value', value);
                };
                VaadinDatePicker.prototype.registerOnChange = function (fn) { this.onChange = fn; };
                VaadinDatePicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
                VaadinDatePicker.prototype.ngOnInit = function () {
                    this._control = this._injector.get(common_1.NgControl, null);
                };
                VaadinDatePicker.prototype.valuechanged = function (value) {
                    var _this = this;
                    this.valueChange.emit(value);
                    if (this._initialValueSet) {
                        // Do not trigger onChange when the initial (empty) value is set
                        // to keep the field as "pristine".
                        this.onChange(value);
                    }
                    else {
                        this._initialValueSet = true;
                    }
                    // Pass the invalid state to our native vaadin-date-picker element if
                    // it is an ngControl.
                    if (this._control != null) {
                        setTimeout(function () {
                            _this._element.invalid = !_this._control.pristine && !_this._control.valid;
                        }, 0);
                    }
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], VaadinDatePicker.prototype, "valueChange", void 0);
                __decorate([
                    core_1.HostListener('value-changed', ['$event.detail.value']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], VaadinDatePicker.prototype, "valuechanged", null);
                VaadinDatePicker = __decorate([
                    core_1.Directive({
                        selector: 'vaadin-date-picker',
                        providers: [VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, core_1.Injector])
                ], VaadinDatePicker);
                return VaadinDatePicker;
            }());
            exports_1("VaadinDatePicker", VaadinDatePicker);
        }
    }
});

//# sourceMappingURL=vaadin-date-picker.js.map
