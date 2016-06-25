/**
 * Ship model.
 *
 * @memberOf game
 */
export default class Ship {
	/**
	 * Create instance of Ship model.
	 *
	 * @param {Number} length Ship size.
	 */
	constructor( length ) {
		/**
		 * Ship length. Amount of ship fields.
		 *
		 * @memberOf {Number} Ship#length
		 */
		this.length = length;
	}

	/**
	 * Serialize ship model to JSON format.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			length: this.length
		};
	}
}
