"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliam = void 0;
const emitter_service_1 = require("@services/emitter.service");
const container_service_1 = require("@services/container.service");
/**
 * @summary Main class of cliam project. The Cliam class act as entry point and open wrapped methods such subscribe and emit.
 *
 * @public
 */
class Cliam {
    constructor(emitter) {
        this.emitter = emitter;
        this.subscribe('default');
        this.subscribe('event.subscribe');
        this.subscribe('event.unsubscribe');
        this.subscribe('event.updated');
        this.subscribe('user.bye');
        this.subscribe('user.confirm');
        this.subscribe('user.contact');
        this.subscribe('user.invite');
        this.subscribe('user.progress');
        this.subscribe('user.survey');
        this.subscribe('user.welcome');
        this.subscribe('order.invoice');
        this.subscribe('order.progress');
        this.subscribe('order.shipped');
        this.subscribe('password.request');
        this.subscribe('password.updated');
    }
    /**
     *
     * @param emitter
     */
    static get(emitter) {
        if (!Cliam.instance) {
            Cliam.instance = new Cliam(emitter);
        }
        return Cliam.instance;
    }
    /**
     * @description
     *
     * @param event
     */
    subscribe(event) {
        this.emitter.subscribe(event);
    }
    /**
     * @description
     */
    async emit(event, payload) {
        return this.emitter.emit(event, payload);
    }
}
/**
 * @description
 */
Cliam.instance = null;
const cliam = Cliam.get(emitter_service_1.Emitter.get(container_service_1.Container.configuration));
exports.Cliam = cliam;
