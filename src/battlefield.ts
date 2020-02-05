import Position from './position';
import Field from './field';
import Ship from './ship';
import Observable, { ObservableInterface } from 'js-utils/src/observable';
import mix from 'js-utils/src/mix';

type ShipsSchema = { [ key: number ]: number };

/**
 * Stores information about items placed on the battlefield and provides API to arrange them.
 */
export default class Battlefield implements ObservableInterface {
	/**
	 * The size of the battlefield.
	 */
	readonly size: number;

	/**
	 * Definition of ships that can be placed on the battlefield.
	 */
	readonly shipsSchema: ShipsSchema;

	/**
	 * Defines when battlefield API is locked for all actions.
	 */
	isLocked: boolean = false;

	/**
	 * Defines if any of ships placed on the battlefield has a collision.
	 */
	hasCollision: boolean = false;

	/**
	 * @param size Size of the battlefield.
	 * @param shipsSchema Defines how many ships of specific length will be in the game.
	 */
	constructor( size: number, shipsSchema: ShipsSchema ) {
		this.size = size;
		this.shipsSchema = shipsSchema;
		this.createObservable( 'isLocked', 'hasCollision' );

		/**
		 * Ships collection.
		 *
		 * @type {ShipsCollection}
		 */
		this.shipsCollection = new ShipsCollection();
		this.shipsCollection.on( 'add', ( evt, ship ) => {
			if ( ship.hasPosition() ) {
				this.moveShip( ship, ship.position, ship.isRotated );
			}
		} );

		/**
		 * Collection of fields that contains information about items placed on the battlefield.
		 *
		 * @protected
		 * @type {Collection<Field>}
		 */
		this._fields = new Collection();
		this._fields.delegate( 'add', 'remove' ).to( this );
	}

	get settings() {
		return {
			size: this.size,
			shipsSchema: this.shipsSchema
		};
	}

	/**
	 * Marks field of given position by a marker of given type.
	 *
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 * @param {'missed'|'hit'} type Marker type.
	 */
	markAs( position, type ) {
		if ( type == 'missed' ) {
			this.markAsMissed( position );
		} else {
			this.markAsHit( position );
		}
	}

	/**
	 * Marks field as missed.
	 *
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 */
	markAsMissed( position ) {
		this._getFieldOrCreate( position ).markAsMissed();
	}

	/**
	 * Marks field as hit.
	 *
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 */
	markAsHit( position ) {
		this._getFieldOrCreate( position ).markAsHit();
	}

	/**
	 * Gets field on given position.
	 *
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 * @returns {Field|undefined}
	 */
	getField( position ) {
		return this._fields.get( position.join( 'x' ) );
	}

	/**
	 * Gets field on given position or create new one when position is empty.
	 *
	 * @private
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 * @returns {Field}
	 */
	_getFieldOrCreate( position ) {
		let field = this.getField( position );

		if ( !field ) {
			field = new Field( position );
			this._fields.add( field );
		}

		return field;
	}

	/**
	 * Places given ship on the given position on the battlefield.
	 * Checks collision of ship. Keeps ship in battlefield bounds.
	 *
	 * @param {Ship} ship Ship instance.
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 * @param {Boolean} isRotated When `true` then ship will be rotated.
	 */
	moveShip( ship, position, isRotated ) {
		if ( this.isLocked ) {
			return;
		}

		if ( isRotated === undefined ) {
			isRotated = ship.isRotated;
		}

		const max = this.size - ship.length;
		let [ x, y ] = position;

		if ( isRotated ) {
			y = y > max ? max : y;
		} else {
			x = x > max ? max : x;
		}

		// Update position of moved ship on the battlefield.
		for ( const pos of ship.getPositions() ) {
			const field = this.getField( pos );

			if ( field && field.getShip( ship.id ) ) {
				if ( field.length == 1 ) {
					this._fields.remove( pos.join( 'x' ) );
				} else {
					field.removeShip( ship.id );
				}
			}
		}

		ship.isRotated = isRotated;
		ship.position = [ x, y ];

		for ( const pos of ship.getPositions() ) {
			this._getFieldOrCreate( pos ).addShip( ship );
		}

		// Check for collisions.
		this.verifyExistingCollisions( ship );
		this.checkShipCollision( ship );

		this.isCollision = Array.from( this ).some( field => {
			return Array.from( field ).some( ship => ship.isCollision );
		} );
	}

	/**
	 * Rotates ship.
	 *
	 * @param {Ship} ship
	 */
	rotateShip( ship ) {
		this.moveShip( ship, ship.position, !ship.isRotated );
	}

	/**
	 * Checks if ship has a collision with other ships on the battlefield.
	 *
	 * @param {Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true` otherwise return `false`.
	 */
	checkShipCollision( ship ) {
		let isCollision = false;

		for ( const position of ship.getPositions() ) {
			let field = this.getField( position );

			// If there is more than one ship on this position then there is a collision.
			// Mark each ship on this field as collision.
			isCollision = checkShipCollisionOnField( ship, field ) || isCollision;

			// If surrounding fields contain other ship then mark each ship on this fields as collision.
			for ( const surroundingPosition of getSurroundingPositions( position ) ) {
				field = this.getField( surroundingPosition );

				if ( field ) {
					isCollision = checkShipCollisionOnField( ship, field ) || isCollision;
				}
			}
		}

		ship.isCollision = isCollision;

		return isCollision;
	}

	/**
	 * Checks if ships marked as collision still have a collision.
	 */
	verifyExistingCollisions() {
		for ( const field of this ) {
			for ( const ship of field ) {
				if ( ship.isCollision ) {
					this.checkShipCollision( ship );
				}
			}
		}
	}

	/**
	 * Checks if given ships don't stick out of battleship bounds and don't have collision.
	 *
	 * @param {Array<Object>} shipsJSON
	 * @returns {Boolean}
	 */
	validateShips( shipsJSON ) {
		const ships = ShipsCollection.createShipsFromJSON( shipsJSON );

		if ( !ships.length ) {
			return false;
		}

		const battlefield = new this.constructor( this.size, {} );

		const result = ships.every( ship => {
			const isHeadInBounds = isPositionInBounds( ship.position, this.size );
			const isTailInBounds = isPositionInBounds( ship.tail, this.size );

			if ( !isHeadInBounds || !isTailInBounds ) {
				return false;
			}

			battlefield.moveShip( ship, ship.position, ship.isRotated );

			return !ship.isCollision;
		} );

		battlefield.destroy();

		return result;
	}

	/**
	 * Removes all markers and takes off all ships from the battlefield.
	 */
	reset() {
		this._fields.clear();

		for ( const ship of this.shipsCollection ) {
			ship.reset();
		}
	}

	/**
	 * Removes all markers and ships.
	 */
	clear() {
		this.shipsCollection.clear();
		this._fields.clear();
	}

	/**
	 * Clears all listeners.
	 */
	destroy() {
		this.stopListening();
		this.shipsCollection.stopListening();
	}

	/**
	 * @returns {Iterator.<Field>}
	 */
	[ Symbol.iterator ]() {
		return Array.from( this._fields )[ Symbol.iterator ]();
	}
}

mix( Battlefield, Observable );

/**
 * Check if ship has collision with other ships on the same field.
 *
 * @private
 * @param {Ship} ship Ship instance.
 * @param {Field} field Field instance.
 * @returns {Boolean}
 */
function checkShipCollisionOnField( ship, field ) {
	let isCollision = false;

	for ( const item of field ) {
		if ( item !== ship ) {
			item.isCollision = isCollision = true;
		}
	}

	return isCollision;
}
