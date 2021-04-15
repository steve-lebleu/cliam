"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
require('module-alias/register');
const Chalk = require("chalk");
const fs_1 = require("fs");
const transporter_factory_1 = require("@transporters/transporter.factory");
const client_configuration_class_1 = require("@classes/client-configuration.class");
const configuration_validation_1 = require("@validations/configuration.validation");
/**
 * @description
 *
 * @todo LOW :: Refactoring : should be simplified / cleaned : reading should not be here, this.transporter & this.configuration should be in a slot
 */
class Container {
    constructor() {
        /**
         * @description
         */
        this.configuration = null;
        /**
         * @description
         */
        this.transporter = null;
        /**
         * @description
         */
        this.PATH = `${process.cwd()}/.cliamrc.json`;
    }
    /**
     * @description
     */
    static get() {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance.set();
    }
    /**
     * @description
     */
    set() {
        this.configuration = new client_configuration_class_1.ClientConfiguration(this.validates(this.read(this.PATH)));
        const params = Object.assign({ domain: this.configuration.consumer.domain }, {
            apiKey: this.configuration.mode?.api?.credentials?.apiKey,
            token: this.configuration.mode?.api?.credentials?.token,
            smtp: this.configuration.mode?.smtp
        });
        this.transporter = transporter_factory_1.TransporterFactory.get(this.configuration.mode?.api?.name || 'smtp', params);
        return this;
    }
    /**
     * @description
     *
     * @param path
     */
    read(path) {
        if (!fs_1.existsSync(path)) {
            process.stdout.write(Chalk.bold.red('.cliamrc.json file cannot be found\n'));
            process.exit(0);
        }
        const content = fs_1.readFileSync(path, { encoding: 'utf-8' });
        if (!content) {
            process.stdout.write(Chalk.bold.red('.cliamrc.json content not found\n'));
            process.exit(0);
        }
        return JSON.parse(content);
    }
    /**
     * @description
     *
     * @param configuration
     */
    validates(configuration) {
        const error = configuration_validation_1.configurationSchema.validate(configuration, { abortEarly: true, allowUnknown: false })?.error;
        if (error) {
            process.stdout.write(Chalk.bold.red(`Error in .cliamrc.json: ${error.details.shift().message}\n`));
            process.exit(0);
        }
        return configuration;
    }
}
/**
 * @description
 */
Container.instance = null;
const service = Container.get();
exports.Container = service;
