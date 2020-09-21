"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.roomnr = exports.RoomSmComponent = void 0;
var core_1 = require("@angular/core");
var RoomSmComponent = /** @class */ (function () {
    function RoomSmComponent() {
        this.roomnr = this.getRandom();
    }
    RoomSmComponent.prototype.ngOnInit = function () {
    };
    RoomSmComponent.prototype.getRandom = function () {
        return Math.floor(Math.random() * 10);
    };
    RoomSmComponent = __decorate([
        core_1.Component({
            selector: 'app-room-sm',
            templateUrl: './room-sm.component.html',
            styleUrls: ['./room-sm.component.scss']
        })
    ], RoomSmComponent);
    return RoomSmComponent;
}());
exports.RoomSmComponent = RoomSmComponent;
