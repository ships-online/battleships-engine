import mix from 'lib/utils/mix.js';
import ObservableMixin from 'lib/utils/observablemixin.js';
import uid from 'lib/utils/uid.js';

/**
 * Item which can be placed on the {@link game.Battlefield}.
 *
 * @memberOf game
 */
class Item {
	/**
	 * Create instance of Item class.
	 *
	 * @param {Number} length Item size.
	 * @param {Number} [id=uid()] Item id.
	 */
	constructor( length, id = uid() ) {
		/**
		 * Item id.
		 *
		 * @readonly
		 * @member {Number} game.Item#id
		 */
		this.id = id;

		/**
		 * Item length.
		 *
		 * @readonly
		 * @member {Number} game.Item#length
		 */
		this.length = length;

		/**
		 * Position of the item first field on the battlefield. E.g. [ 1, 1 ].
		 *
		 * @observable
		 * @member {Array} game.Item#firstFieldPosition
		 */
		this.set( 'firstFieldPosition', [ null, null ] );

		/**
		 * Item orientation.
		 *
		 * @observable
		 * @readonly
		 * @member {'horizontal'|'vertical'} game.Item#orientation
		 */
		this.set( 'orientation', 'horizontal' );
	}

	/**
	 * Return array of coordinates on battlefield.
	 *
	 * @returns {Array<Array>}
	 */
	get coordinates() {
		if ( typeof this.firstFieldPosition[ 0 ] != 'number' || typeof this.firstFieldPosition[ 1 ] != 'number' ) {
			return [];
		}

		const fields = [ this.firstFieldPosition ];

		for ( let i = 1; i < this.length; i++ ) {
			// Clone previous field.
			let nextField = fields[ i - 1 ].concat( [] );

			++nextField[ this.isRotated ? 1 : 0 ];

			fields.push( nextField );
		}

		return fields;
	}

	/**
	 * Toggle {#orientation} between `vertical` and `horizontal`.
	 */
	rotate() {
		this.orientation = this.isRotated ? 'horizontal' : 'vertical';
	}

	get isRotated() {
		return this.orientation === 'vertical';
	}

	/**
	 * Serialize item to JSON format.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			id: this.id,
			coordinates: this.coordinates
		};
	}
}

mix( Item, ObservableMixin );

export default Item;
