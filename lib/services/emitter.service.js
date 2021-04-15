"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
require('module-alias/register');
const subscriber_service_1 = require("@services/subscriber.service");
/**
 * @summary
 */
class Emitter {
    constructor(configuration) {
        /**
         * @description
         */
        this.subscribers = [];
        /**
         * @description
         */
        this.configuration = null;
        this.configuration = configuration;
    }
    /**
     * @description
     *
     * @param emitter
     */
    static get(configuration) {
        if (!Emitter.instance) {
            Emitter.instance = new Emitter(configuration);
        }
        return Emitter.instance;
    }
    /**
     * @description
     *
     * @param event
     */
    subscribe(event) {
        if (this.subscribers.filter(subscriber => subscriber.event === event).length === 0) {
            this.subscribers.push(new subscriber_service_1.Subscriber(event));
        }
    }
    /**
     * @description
     *
     * @param event
     */
    unsubscribe(event) {
        const idx = this.subscribers.findIndex(entry => entry.event === event);
        if (idx) {
            this.subscribers.splice(idx, 1);
        }
    }
    /**
     * @description
     *
     * @param event
     */
    list(event = null) {
        return this.subscribers.filter(subscriber => event ? subscriber.event === event : true).map(subscriber => subscriber.event);
    }
    /**
     * @description
     */
    count() {
        return this.subscribers.length;
    }
    /**
     * @description
     *
     * @param event
     */
    async emit(event, payload) {
        return this.subscribers.find(subscriber => subscriber.event === event)?.handler(event, payload);
    }
}
exports.Emitter = Emitter;
/**
 * @description
 */
Emitter.instance = null;
