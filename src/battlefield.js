import Ship from './ship.js';
import ShipsCollection from './shipscollection.js';

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
	 * @param {Object} [shipsConfig] Defines how many ships of specified length will be on the battlefield.
	 */
	constructor( size, shipsConfig ) {
		/**
		 * Size of the battlefield.
		 *
		 * @type {Number}
		 */
		this.size = size;

		/**
		 * Ships collection.
		 *
		 * @type {game.ShipsCollection}
		 */
		this.shipsCollection = new ShipsCollection( shipsConfig );

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
		 * @type {Map}
		 */
		this._fields = new Map();
	}

	/**
	 * Sets item into specified field.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @param {game.Item} item Item to put on the battlefield.
	 */
	set( position, item ) {
		const field = this.get( position );

		if ( field ) {
			field.push( item );
		} else {
			this._fields.set( position.join( 'x' ), [ item ] );
		}
	}

	/**
	 * Gets items from specified field.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @returns {Array<game.Item>} List of items.
	 * @returns {null} When field does not exist.
	 */
	get( position ) {
		const key = position.join( 'x' );

		return this._fields.has( key ) ? this._fields.get( key ) : null;
	}

	moveShip( ship, position, isRotated ) {
		if ( isRotated === undefined ) {
			isRotated = ship.isRotated;
		}

		// Update position of moved ship on the battlefield.
		ship.coordinates.forEach( ( pos ) => this._remove( pos, ship ) );

		ship.isRotated = isRotated;
		ship.position = position;

		ship.coordinates.forEach( ( pos ) => this.set( pos, ship ) );

		// Check if ships with collision still have a collision after one ship was moved.
		for ( let collisionShip of this.shipsCollection.getWithCollision() ) {
			this.checkShipCollision( collisionShip );
		}

		// Check if moved ship has a collision.
		this.checkShipCollision( ship );
	}

	rotateShip( ship ) {
		this.moveShip( ship, ship.position, !ship.isRotated );
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
		const field = this.get( position );

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
	checkShipCollision( ship ) {
		let isCollision = false;

		for ( let position of ship.coordinates ) {
			let field = this.get( position );

			// If there is more than one ship on this position then there is a collision.
			// Mark each ship on this field as collision.
			isCollision = checkShipCollisionOnField( ship, field, position ) || isCollision;

			// Get surrounding fields.
			const top = Battlefield.getPositionAtTheTopOf( position );
			const right = Battlefield.getPositionAtTheRightOf( position );
			const bottom = Battlefield.getPositionAtTheBottomOf( position );
			const left = Battlefield.getPositionAtTheLeftOf( position );
			const topLeft = Battlefield.getPositionAtTheTopOf( left );
			const topRight = Battlefield.getPositionAtTheTopOf( right );
			const bottomRight = Battlefield.getPositionAtTheBottomOf( right );
			const bottomLeft = Battlefield.getPositionAtTheBottomOf( left );

			// If surrounding fields contain other ship then mark each ship on this fields as collision.
			[ top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft ].forEach( ( pos ) => {
				field = this.get( pos );

				if ( field ) {
					isCollision = checkShipCollisionOnField( ship, field, pos ) || isCollision;
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

/**
 * Check if ship has collision with other ship in specified field.
 *
 * @private
 * @param {game.Ship} ship Ship instance.
 * @param {Array<{game.Item}>|null} field
 * @returns {boolean}
 */
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
