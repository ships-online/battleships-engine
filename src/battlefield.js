import Ship from './ship.js';

/**
 * Stores information about items placed on the battlefield.
 *
 * @memberOf {game}
 */
export default class Battlefield {
	/**
	 * Creates instance of Battlefield class.
	 *
	 * @param {Number} size Size of the battlefield.
	 */
	constructor( size ) {
		/**
		 * Size of the battlefield.
		 *
		 * @member {Number} game.Battlefield#size
		 */
		this.size = size;

		/**
		 * Information about items placed on the battlefield.
		 *
		 * E.g:
		 *
		 * 		{ 'XxY' => [ {@link game.Item}, {@link game.Item} ] }
		 *
		 * where `XxY` is a position on the battlefield (result of `[ positionX, positionY ].join( 'x' )`).
		 *
		 * @private
		 * @member {Map} game.Battlefield#_fields
		 */
		this._fields = new Map();
	}

	/**
	 * Puts and moves item on the battlefield.
	 *
	 * @param {game.Item} item Item instance.
	 * @param {Array<Number>} position Position x, y e.g. [ 1, 1 ].
	 * @param {Boolean} [rotate] When `true` then item will be rotated.
	 */
	move( item, position, rotate ) {
		item.coordinates.forEach( ( pos ) => this._remove( pos, item ) );

		if ( rotate ) {
			item.rotate();
		}

		item.firstFieldPosition = position;
		item.coordinates.forEach( ( pos ) => this._set( pos, item ) );
	}

	/**
	 * Sets item into specified field.
	 *
	 * @private
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @param {game.Item} item Item to put on the battlefield.
	 */
	_set( position, item ) {
		const field = this._get( position );

		if ( field ) {
			field.push( item );
		} else {
			this._fields.set( position.join( 'x' ), [ item ] );
		}
	}

	/**
	 * Gets items from specified field.
	 *
	 * @private
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @returns {Array<game.Item>} List of items.
	 * @returns {null} When field does not exist.
	 */
	_get( position ) {
		const key = position.join( 'x' );

		return this._fields.has( key ) ? this._fields.get( key ) : null;
	}

	/**
	 * Deletes specified item from specified field. If item is the only item on the field,
	 * then delete whole field from storage.
	 *
	 * @private
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @param {game.Item} item Item to delete from field.
	 */
	_remove( position, item ) {
		const field = this._get( position );

		if ( field.length == 1 ) {
			this._fields.delete( position.join( 'x' ) );
		} else {
			field.splice( field.indexOf( item ), 1 );
		}
	}

	/**
	 * Check if ship has a collision with other ships. For each ship which has a collision set
	 * {@link game.Ship#isCollision} as `true`. If ship has no collision set {@link game.Ship#isCollision} as `false`.
	 *
	 * @param {game.Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true`, return `false` when there is no collision.
	 */
	validateShipCollision( ship ) {
		let isCollision = false;

		for ( let position of ship.coordinates ) {
			let field = this._get( position );

			// There is more than one ship on this position so there is a collision.
			// Mark each ship on this field as collision.
			isCollision = checkShipCollisionOnField( ship, field );

			// Get surrounded fields.
			const top = Battlefield.getPositionAtTheTopOf( position );
			const topRight = Battlefield.getPositionAtTheRightOf( top );
			const right = Battlefield.getPositionAtTheRightOf( position );
			const bottomRight = Battlefield.getPositionAtTheBottomOf( right );
			const bottom = Battlefield.getPositionAtTheBottomOf( position );
			const bottomLeft = Battlefield.getPositionAtTheLeftOf( bottom );
			const left = Battlefield.getPositionAtTheLeftOf( position );
			const topLeft = Battlefield.getPositionAtTheTopOf( left );

			// If surrounded field contains other ship then mark each ship on this fields as collision.
			[ top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft ].forEach( ( pos ) => {
				field = this._get( pos );

				if ( field ) {
					isCollision = checkShipCollisionOnField( ship, this._get( position ) );
				}
			} );
		}

		ship.isCollision = isCollision;

		return isCollision;
	}

	/**
	 * Get position at the top of passed position.
	 *
	 * @static
	 * @param {Array<Number>} position Position [ x, y ].
	 * @returns {Array<Number>} Position [ x, y ].
	 */
	static getPositionAtTheTopOf( position ) {
		return [ position[ 0 ], position[ 1 ] - 1 ];
	}

	/**
	 * Get position at the right of passed position.
	 *
	 * @static
	 * @param {Array<Number>} position Position [ x, y ].
	 * @returns {Array<Number>} Position [ x, y ].
	 */
	static getPositionAtTheRightOf( position ) {
		return [ position[ 0 ] + 1, position[ 1 ] ];
	}

	/**
	 * Get position at the bottom of passed position.
	 *
	 * @static
	 * @param {Array<Number>} position Position [ x, y ].
	 * @returns {Array<Number>} Position [ x, y ].
	 */
	static getPositionAtTheBottomOf( position ) {
		return [ position[ 0 ], position[ 1 ] + 1 ];
	}

	/**
	 * Get position at the left of passed position.
	 *
	 * @static
	 * @param {Array<Number>} position Position [ x, y ].
	 * @returns {Array<Number>} Position [ x, y ].
	 */
	static getPositionAtTheLeftOf( position ) {
		return [ position[ 0 ] - 1, position[ 1 ] ];
	}
}

function checkShipCollisionOnField( ship, field ) {
	let isCollision = false;

	field.forEach( ( item ) => {
		if ( item instanceof Ship && item !== ship ) {
			item.isCollision = true;
			isCollision = true;
		}
	} );

	return isCollision;
}