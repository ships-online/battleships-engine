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
	constructor( id, length ) {
		/**
		 * Ship id.
		 *
		 * @readonly
		 * @member {Number} Ship#id
		 */
		this.id = id;
		/**
		 * Ship length. Amount of ship fields.
		 *
		 * @readonly
		 * @member {Number} Ship#length
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
