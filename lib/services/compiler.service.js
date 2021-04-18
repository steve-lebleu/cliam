"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const fs_1 = require("fs");
const Hbs = require("hbs");
const Color = require("color");
const html_to_text_1 = require("html-to-text");
const container_service_1 = require("./../services/container.service");
/**
 * On the fly hbs compilation middleware
 */
class Compiler {
    constructor() {
        /**
         * @description
         */
        this.THEME = container_service_1.Container.configuration.consumer?.theme;
        /**
         * @description
         */
        this.LAYOUT = '/../../src/views/layouts/default.hbs';
        /**
         * @description
         */
        this.PARTIALS = '/../../src/views/partials';
        /**
         * @description
         */
        this.BLOCKS = '/../../src/views/blocks';
        /**
         * @description
         */
        this.TEMPLATES = [
            { event: 'default', banner: '', default: true },
            { event: 'event.subscribe', banner: '', default: true },
            { event: 'event.unsubscribe', banner: '', default: true },
            { event: 'event.updated', banner: '', default: true },
            { event: 'order.invoice', banner: '' },
            { event: 'order.progress', banner: '' },
            { event: 'order.shipped', banner: '' },
            { event: 'password.request', banner: '', default: true },
            { event: 'password.updated', banner: '', default: true },
            { event: 'user.invite', banner: '' },
            { event: 'user.contact', banner: '', default: true },
            { event: 'user.progress', banner: '' },
            { event: 'user.survey', banner: '' },
            { event: 'user.welcome', banner: '', default: true },
            { event: 'user.bye', banner: '', default: true },
            { event: 'user.confirm', banner: '', default: true }
        ];
        /**
         * @description
         */
        this.SOCIALS = [
            { github: 'https://i.ibb.co/Hq6W16r/github.png' },
            { youtube: 'https://i.ibb.co/NSqy5pf/youtube.png' },
            { pinterest: 'https://i.ibb.co/Px9MD9c/pinterest.png' },
            { linkedin: 'https://i.ibb.co/vQXvN73/linkedin.png' },
            { instagram: 'https://i.ibb.co/PMYPdQ8/instagram.png' },
            { twitter: 'https://i.ibb.co/pJ8nxnS/twitter.png' },
            { facebook: 'https://i.ibb.co/wSZ1ks0/faceboook.png' }
        ];
        /**
         * @description
         */
        this.COLORS = [
            { key: '111111', value: this.THEME?.primaryColor || null },
            { key: '222222', value: this.THEME?.secondaryColor || null },
            { key: '333333', value: this.THEME?.tertiaryColor || null },
            { key: '444444', value: this.THEME?.quaternaryColor || null },
            { key: 'fffff1', value: this.THEME?.primaryColor ? Color(`#${this.THEME.primaryColor}`).lighten(0.50).hex().substring(1) : null },
            { key: 'fffff2', value: this.THEME?.secondaryColor ? Color(`#${this.THEME.secondaryColor}`).lighten(0.50).hex().substring(1) : null },
            { key: 'fffff3', value: this.THEME?.tertiaryColor ? Color(`#${this.THEME.tertiaryColor}`).lighten(0.50).hex().substring(1) : null },
            { key: 'fffff4', value: this.THEME?.quaternaryColor ? Color(`#${this.THEME.quaternaryColor}`).lighten(0.50).hex().substring(1) : null },
            { key: '000001', value: this.THEME?.primaryColor ? Color(`#${this.THEME.primaryColor}`).darken(0.50).hex().substring(1) : null },
            { key: '000002', value: this.THEME?.secondaryColor ? Color(`#${this.THEME.secondaryColor}`).darken(0.50).hex().substring(1) : null },
            { key: '000003', value: this.THEME?.tertiaryColor ? Color(`#${this.THEME.tertiaryColor}`).darken(0.50).hex().substring(1) : null },
            { key: '000004', value: this.THEME?.quaternaryColor ? Color(`#${this.THEME.quaternaryColor}`).darken(0.50).hex().substring(1) : null }
        ];
        Hbs.handlebars.registerHelper('year', () => {
            return new Date().getFullYear();
        });
    }
    /**
     * @description
     */
    static get() {
        if (!Compiler.instance) {
            Compiler.instance = new Compiler();
        }
        return Compiler.instance;
    }
    /**
     * @description
     *
     * @param event
     * @param data
     *
     * @todo LOW :: do better about socials and banner
     */
    compile(event, data) {
        if (container_service_1.Container.configuration.consumer.socials) {
            container_service_1.Container.configuration.consumer.socials.map(social => {
                social.icon = this.SOCIALS.find(s => s[social.name])[social.name];
            });
        }
        data.banner = this.getBanner(event);
        Hbs.handlebars.registerPartial('header', Hbs.handlebars.compile(fs_1.readFileSync(`${__dirname}${this.PARTIALS}/header.hbs`, { encoding: 'utf-8' }))(container_service_1.Container.configuration.consumer));
        Hbs.handlebars.registerPartial('body', Hbs.handlebars.compile(fs_1.readFileSync(`${__dirname}${this.BLOCKS}/${this.getSegment(event)}.hbs`, { encoding: 'utf-8' }))(data));
        Hbs.handlebars.registerPartial('footer', Hbs.handlebars.compile(fs_1.readFileSync(`${__dirname}${this.PARTIALS}/footer.hbs`, { encoding: 'utf-8' }))(container_service_1.Container.configuration.consumer));
        const html = Hbs.handlebars.compile(fs_1.readFileSync(`${__dirname}${this.LAYOUT}`, { encoding: 'utf-8' }))(data);
        return {
            text: this.textify(html),
            html: this.customize(html)
        };
    }
    /**
     * @description
     *
     * @param html
     */
    textify(html) {
        return html_to_text_1.htmlToText(html, {});
    }
    /**
     * @description
     *
     * @param event
     */
    getBanner(event) {
        return this.TEMPLATES.find(template => template.event === event).banner || 'http://placehold.it/600x300';
    }
    /**
     * @description
     *
     * @param event
     */
    getSegment(event) {
        return this.TEMPLATES.find(template => template.event === event).default ? 'default' : event;
    }
    /**
     * @description
     *
     * @param html
     */
    customize(html) {
        return this.COLORS.reduce((acc, current) => {
            return acc.replace(new RegExp(current.key, 'g'), current.value);
        }, html);
    }
}
/**
 * @description
 */
Compiler.instance = null;
const service = Compiler.get();
exports.Compiler = service;
