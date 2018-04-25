import Field from './field';
import ShipsCollection from './shipscollection';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * Stores information about items placed on the battlefield and provides API to arrange them.
 *
 * @mixes ObservableMixin
 */
export default class Battlefield {
	/**
	 * @param {Number} size Size of the battlefield.
	 * @param {Object} shipsSchema Defines how many ships of specific length will be in the game.
	 */
	constructor( size, shipsSchema ) {
		/**
		 * Size of the battlefield.
		 *
		 * @type {Number}
		 */
		this.size = size;

		/**
		 * Configuration of ships allowed on the battlefield.
		 *
		 * @type {Object}
		 */
		this.shipsSchema = shipsSchema;

		/**
		 * Defines when battlefield API is locked for all actions.
		 *
		 * @observable
		 * @type {Boolean}
		 */
		this.set( 'isLocked', false );

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
		 * Information about items placed on the battlefield.
		 *
		 * @protected
		 * @type {Map<String, Field>}
		 */
		this._fields = new Map();
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
		this.fire( 'missed', position );
	}

	/**
	 * Marks field as hit.
	 *
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 */
	markAsHit( position ) {
		this._getFieldOrCreate( position ).markAsHit();
		this.fire( 'hit', position );
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
			this._fields.set( field.id, field );
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
		for ( const pos of ship.getCoordinates() ) {
			const field = this.getField( pos );

			if ( field && field.getShip( ship.id ) ) {
				if ( field.length == 1 ) {
					this._fields.delete( pos.join( 'x' ) );
				} else {
					field.removeShip( ship.id );
				}
			}
		}

		ship.isRotated = isRotated;
		ship.position = [ x, y ];

		for ( const pos of ship.getCoordinates() ) {
			this._getFieldOrCreate( pos ).addShip( ship );
		}

		this.fire( 'shipMoved', ship );
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
	 * Checks if given ships don't stick out of battleship bounds and don't have collision.
	 *
	 * @param {Array<Ship>} ships
	 * @returns {boolean}
	 */
	validateShips( ships ) {
		return ships.every( ship => {
			const isInBounds = ship.position[ 0 ] >= 0 && ship.tail[ 0 ] < this.size &&
				ship.position[ 1 ] >= 0 && ship.tail[ 1 ] < this.size;

			return !ship.isCollision && isInBounds;
		} );
	}

	/**
	 * Resets battlefield to the default state.
	 */
	reset() {
		this._fields.clear();

		for ( const ship of this.shipsCollection ) {
			ship.reset();
		}

		this.fire( 'reset' );
	}

	/**
	 * @returns {Iterator.<Field>}
	 */
	[ Symbol.iterator ]() {
		return this._fields.values();
	}
}

mix( Battlefield, ObservableMixin );
