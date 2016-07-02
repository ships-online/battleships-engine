/**
 * Battlefield.
 * Store information about ship placement on battlefield and move ships.
 *
 * @memberOf {Game}
 */
export default class Battlefield {
	/**
	 * Create instance of Battlefield class.
	 *
	 * @param {Number} size Size of the battlefield.
	 */
	constructor( size ) {
		/**
		 * Size of the battlefield.
		 *
		 * @member {Number} Battlefield#size
		 */
		this.size = size;

		/**
		 * Store information about ships placed on the battlefield in format:
		 *
		 * 		{ 'XxY' => [ {@link Ship#id}, {@link Ship#id} ] }
		 *
		 * where `XxY` is a position on the battlefield (result of `[ positionX, positionY ].join( 'x' )`).
		 *
		 * @private
		 * @type {Map}
		 */
		this._fields = new Map();
	}

	/**
	 * Set any item to specific place on the battlefield.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @param {*} item Item to put on the battlefield.
	 */
	setToField( position, item ) {
		const field = this.getField( position );

		if ( field ) {
			field.push( item );
		} else {
			this._fields.set( position.join( 'x' ), [ item ] );
		}
	}

	/**
	 * Get every item on specified field.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @returns {Array<*>} Array of items.
	 * @returns {null} When field does not exist.
	 */
	getField( position ) {
		const key = position.join( 'x' );

		if ( this._fields.has( key ) ) {
			return this._fields.get( key );
		}

		return null;
	}

	/**
	 * Delete specified item from specified field. If item is the only item on the field,
	 * then delete whole field from storage.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @param {*} item Item to delete from field.
	 */
	removeFromField( position, item ) {
		const field = this.getField( position );

		if ( field ) {
			if ( field.length == 1 ) {
				this._fields.delete( position.join( 'x' ) );
			} else {
				field.splice( field.indexOf( item ), 1 );
			}
		}
	}

	/**
	 * Update position of ship on the battlefield.
	 *
	 * @param {game.Ship} ship Ship instance.
	 * @param {Array<Number>} position Position x, y e.g. [ 1, 1 ].
	 */
	updateShipPosition( ship, position ) {
		ship.coordinates.forEach( ( pos ) => this.removeFromField( pos, ship ) );
		ship.position = position;
		ship.coordinates.forEach( ( pos ) => this.setToField( pos, ship ) );
	}

	/**
	 * Check if ship has a collision with other ship. For every ship which has a collision set
	 * {@link game.Ship#isCollision} as `true`. If ship has no collision set {@link game.Ship#isCollision} as `false`.
	 *
	 * @param {game.Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true`, return `false` when there is no collision.
	 */
	checkCollision( ship ) {
		let isCollision = false;

		for ( let position of ship.coordinates ) {
			let field = this.getField( position );

			// There is more than one ship on this position so there is a collision.
			// Mark every ship on this field as collision.
			if ( field.length > 1 ) {
				field.forEach( ( ship ) => ship.isCollision = true );
				isCollision = true;
			}

			// If on sibling field are other ship then mark each as collision.
			[
				'getPositionAtTheTopOf',
				'getPositionAtTheRightOf',
				'getPositionAtTheBottomOf',
				'getPositionAtTheLeftOf'
			].forEach( ( fn ) => {
				field = this.getField( Battlefield[ fn ]( position ) );

				if ( field && ( field.length == 1 && field[ 0 ] != ship ) ) {
					field.forEach( ( ship ) => ship.isCollision = true );
					isCollision = true;
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
