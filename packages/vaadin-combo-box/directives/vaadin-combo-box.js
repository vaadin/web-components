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
    var VAADIN_COMBO_BOX_CONTROL_VALUE_ACCESSOR, VaadinComboBox;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            VAADIN_COMBO_BOX_CONTROL_VALUE_ACCESSOR = new core_1.Provider(common_1.NG_VALUE_ACCESSOR, {
                useExisting: core_1.forwardRef(function () { return VaadinComboBox; }),
                multi: true
            });
            VaadinComboBox = (function () {
                function VaadinComboBox(renderer, el, _injector, differs) {
                    var _this = this;
                    this._injector = _injector;
                    this._initialValueSet = false;
                    this.onChange = function (_) { };
                    this.onTouched = function () { };
                    this.valueChange = new core_1.EventEmitter(false);
                    if (!window.Polymer || !Polymer.isInstance(el.nativeElement)) {
                        console.error("vaadin-combo-box has not been imported yet, please remember to import vaadin-combo-box.html in your main HTML page.");
                        return;
                    }
                    this._renderer = renderer;
                    this._element = el.nativeElement;
                    this._differ = differs.find([]).create(null);
                    this._element.$$('input').addEventListener('blur', function () {
                        _this.onTouched();
                    });
                }
                VaadinComboBox.prototype.writeValue = function (value) {
                    this._renderer.setElementProperty(this._element, 'value', value);
                };
                VaadinComboBox.prototype.registerOnChange = function (fn) { this.onChange = fn; };
                VaadinComboBox.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
                VaadinComboBox.prototype.ngOnInit = function () {
                    this._control = this._injector.get(common_1.NgControl, null);
                };
                VaadinComboBox.prototype.ngDoCheck = function () {
                    var changes = this._differ.diff(this.items);
                    if (changes) {
                        // The items property must be set to a clone of the collection because of
                        // how iron-list behaves.
                        this._element.items = changes.collection.slice(0);
                    }
                };
                VaadinComboBox.prototype.valuechanged = function (value) {
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
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], VaadinComboBox.prototype, "items", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], VaadinComboBox.prototype, "valueChange", void 0);
                __decorate([
                    core_1.HostListener('value-changed', ['$event.detail.value']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], VaadinComboBox.prototype, "valuechanged", null);
                VaadinComboBox = __decorate([
                    core_1.Directive({
                        selector: 'vaadin-combo-box',
                        providers: [VAADIN_COMBO_BOX_CONTROL_VALUE_ACCESSOR]
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, core_1.Injector, core_1.IterableDiffers])
                ], VaadinComboBox);
                return VaadinComboBox;
            }());
            exports_1("VaadinComboBox", VaadinComboBox);
        }
    }
});

//# sourceMappingURL=vaadin-combo-box.js.map
