export default class {
	/**
	 * @param {Object} [options={}]
	 * @param {Number} [options.size] size Store size of the battlefield.
     */
    constructor( options ) {
		/**
		 * Store size of the battlefield. Battlefield is a square and amount of field is equal to {#size} * {#size}.
		 *
		 * @type {Number} #size
         */
		this.size = options.size;
	}
}
