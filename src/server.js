/* global io */

/**
 * Class for communication between client and server.
 */
export default class Server {
	/**
	 * Creates instance of Server class.
	 *
	 * @param {utils.EmitterMixin} gameEmitter Game emitter.
	 */
	constructor( gameEmitter ) {
		/**
		 * Web sockets instance.
		 *
		 * @private
		 * @type {io.socket}
		 */
		this._socket = null;

		/**
		 * Game emitter.
		 *
		 * @private
		 * @type {utils.EmitterMixin}
		 */
		this._gameEmitter = gameEmitter;
	}

	/**
	 * Creates connection with socket server.
	 *
	 * @returns {Promise<String>} gameID Game id.
	 */
	create() {
		return new Promise( ( resolve ) => {
			this._socket = io();

			this._socket.on( 'connect', () => {
				this._request( 'create' ).then( ( gameID ) => resolve( gameID ) );
			} );
		} );
	}

	/**
	 * Sends event to the server.
	 *
	 * @param {String} eventName Event name.
	 * @param {Object} data Event data.
	 */
	emit( eventName, data ) {
		this._socket.emit( eventName, data );
	}

	/**
	 * Emits event to server and wait for immediate response.
	 *
	 * @private
	 * @param {String} requestEvent
	 * @returns {Promise<data>}
	 */
	_request( requestEvent ) {
		return new Promise( ( resolve ) => {
			this._socket.once( `${ requestEvent }Response`, ( ...args ) => resolve( ...args ) );
			this._socket.emit( requestEvent );
		} );
	}
}
