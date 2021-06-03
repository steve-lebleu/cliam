"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transporter = void 0;
/**
 * Main Transporter class
 */
class Transporter {
    constructor() { }
    /**
     * @description
     *
     * @param err
     */
    error(err) { }
    /**
     * @description
     *
     * @param err
     */
    response(res) { }
    /**
     * @description
     *
     * @param err
     */
    build({ ...args }) { }
    /**
     * @description Send email
     *
     * @returns
     */
    async send(body) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(body, (err, info) => {
                if (err) {
                    reject(this.error(err));
                }
                else {
                    resolve(this.response(info));
                }
            });
        });
    }
}
exports.Transporter = Transporter;
