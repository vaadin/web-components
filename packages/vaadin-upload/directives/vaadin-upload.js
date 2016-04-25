System.register(['angular2/core', 'angular2/common', 'angular2/src/facade/lang'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, lang_1;
    var VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR, VaadinUpload;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            }],
        execute: function() {
            VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR = lang_1.CONST_EXPR(new core_1.Provider(common_1.NG_VALUE_ACCESSOR, {
                useExisting: core_1.forwardRef(function () { return VaadinUpload; }),
                multi: true
            }));
            VaadinUpload = (function (_super) {
                __extends(VaadinUpload, _super);
                function VaadinUpload(renderer, el, _injector) {
                    var _this = this;
                    _super.call(this, renderer, el);
                    this._injector = _injector;
                    this._initialValueSet = false;
                    this.filesChange = new core_1.EventEmitter(false);
                    if (!window.Polymer || !Polymer.isInstance(el.nativeElement)) {
                        console.error("vaadin-upload has not been imported yet, please remember to import vaadin-upload.html in your main HTML page.");
                        return;
                    }
                    this._element = el.nativeElement;
                    this._element.$$('paper-button').addEventListener('blur', function () {
                        _this.onTouched();
                    });
                }
                VaadinUpload.prototype.fileschanged = function () {
                    if (!this._initialValueSet) {
                        // Do not trigger onChange when the initial (empty) value is set
                        // to keep the field as "pristine".
                        this._initialValueSet = true;
                        return;
                    }
                    var value = this._element.files;
                    this.filesChange.emit(value);
                    this.onChange(value);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
                ], VaadinUpload.prototype, "filesChange", void 0);
                __decorate([
                    core_1.HostListener('files-changed'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], VaadinUpload.prototype, "fileschanged", null);
                VaadinUpload = __decorate([
                    core_1.Directive({
                        selector: 'vaadin-upload',
                        providers: [VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_b = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object, (typeof (_d = typeof core_1.Injector !== 'undefined' && core_1.Injector) === 'function' && _d) || Object])
                ], VaadinUpload);
                return VaadinUpload;
                var _a, _b, _c, _d;
            })(common_1.DefaultValueAccessor);
            exports_1("VaadinUpload", VaadinUpload);
        }
    }
});
//# sourceMappingURL=vaadin-upload.js.map