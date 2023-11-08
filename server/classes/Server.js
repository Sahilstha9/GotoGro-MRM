'use strict';

// environment file
require("dotenv").config({ path: "../config.env" });

const EventEmitter = require("events");

/**
 * The main hub for interacting with the server.
 * @extends {EventEmitter}
 */
class Server extends EventEmitter {
    /**
     * @param {Object} options Options for the server
     */
    constructor(options) {
        super();

        this.express = require("express");
        this.mongoDb = require("mongodb");

        this.app = this.express();
        this.port = process.env.SERVER_PORT || options.port || 5000;


        //const data = require('worker_threads').workerData ?? process.env;

        //this.db = {};

        Object.defineProperty(this, 'mongoUri', { writable: true });
        if (!this.mongoUri && 'ATLAS_URI' in process.env) {
            /**
             * Authorization token for the logged in database.
             * If present, this defaults to `process.env.ATLAS_URI` when instantiating the server client
             * <warn>This should be kept private at all times.</warn>
             * @type {?string}
             */
            this.mongoUri = process.env.ATLAS_URI;
        } else {
            this.mongoUri = null;
        }
        this.MongoClient = new this.mongoDb.MongoClient(this.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        /**
         * Time at which the server client was last regarded as being in the `READY` state
         * (each time the server client disconnects and successfully reconnects, this will be overwritten)
         * @type {?Date}
         */
        this.readyAt = null;
    }

    init() {



    }

    start() {
        this.triggerServerReady();
    }

    /**
     * Timestamp of the time the server client was last `READY` at
     * @type {?number}
     * @readonly
     */
    get readyTimestamp() {
    return this.readyAt?.getTime() ?? null;
}

    /**
     * How long it has been since the server client last entered the `READY` state in milliseconds
     * @type {?number}
     * @readonly
     */
    get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
}

    /**
     * Logs the server in, establishing a connection to mongoDb.
     * @param {string} [token=this.token] Token of the account to log in with
     * @returns {Promise<string>} Token of the account used
     * @example
     * server.login('my token');
     */

   /*
   async login(token = this.db.token) {
    if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID');
    this.db.token = token;
    this.emit(
        'debug',
        `Provided token: ${token
            .split('.')
            .map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
            .join('.')}`,
    );

    this.emit('debug', 'Preparing to connect to the database...');


}
*/
    /**
     * Causes the server to be marked as ready and emits the ready event.
     * @private
     */
    triggerServerReady() {
        this.status = 0;

        this.readyAt = new Date();

        /**
         * Emitted when the server client becomes ready to start working.
         * @event Server#ready
         * @param {Server} this The client
         */
        this.emit('ready', this);
        //this.handlePacket();
    }

    /**
     * Returns whether the server client has logged in, indicative of being able to access
     * properties such as `user`.
     * @returns {boolean}
     */

    toJSON() {
    return super.toJSON({
        readyAt: false,
    });
}
}
module.exports = Server;

/**
 * Emitted for general warnings.
 * @event Server#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information.
 * @event Server#debug
 * @param {string} info The debug information
 */

