import Battlefield from '../battlefield';
import Ship from '../../ship';

interface CollisionInterface extends Battlefield {}

class CollisionInterface {
	/**
	 * `true` when there is at least one collision o the battlefield, `false` otherwise.
	 */
	hasCollision: boolean;

	/**
	 * @param ship
	 */
	checkCollision( ship: Ship ): boolean {
		let hasCollision = false;

		// Check the given ship and all ships that already had a collision.
		const shipsToCheck = [ ship, ...this.getShips().filter( ship => ship.hasCollision ) ];

		for ( ship of shipsToCheck ) {
			if ( this._checkShipCollision( ship ) ) {
				hasCollision = true;
			}
		}

		this.hasCollision = hasCollision;

		return hasCollision;
	}

	/**
	 * Checks if ship has a collision with other ships on the battlefield.
	 *
	 * @param ship Ship to check.
	 * @returns If ship has a collision return `true`, return `false` otherwise.
	 */
	private _checkShipCollision( ship: Ship ): boolean {
		const positionsToCheck = new Map();

		// First collect all positions to check.
		// Map is used to avoid duplications.
		for ( const position of ship.coordinates ) {
			positionsToCheck.set( position.toString(), position );

			for ( const pos of position.getSurroundingPositions() ) {
				positionsToCheck.set( pos.toString(), pos );
			}
		}

		let hasCollision = false;

		// Then check if the given ship has a collision with ships on collected positions.
		for ( const position of positionsToCheck.values() ) {
			if ( this._hasField( position ) ) {
				for ( const shipOnField of this._getField( position ).getShips() ) {
					if ( shipOnField !== ship ) {
						shipOnField.hasCollision = true;
						hasCollision = true;
					}
				}
			}
		}

		ship.hasCollision = hasCollision;

		return hasCollision;
	}

	// /**
	//  * Checks if given ships don't stick out of battleship bounds and don't have collision.
	//  *
	//  * @param {Array<Object>} shipsJSON
	//  * @returns {Boolean}
	//  */
	// validateShips( shipsJSON ) {
	// 	const ships = ShipsCollection.createShipsFromJSON( shipsJSON );
	//
	// 	if ( !ships.length ) {
	// 		return false;
	// 	}
	//
	// 	const battlefield = new this.constructor( this.size, {} );
	//
	// 	const result = ships.every( ship => {
	// 		const isHeadInBounds = isPositionInBounds( ship.position, this.size );
	// 		const isTailInBounds = isPositionInBounds( ship.tail, this.size );
	//
	// 		if ( !isHeadInBounds || !isTailInBounds ) {
	// 			return false;
	// 		}
	//
	// 		battlefield.moveShip( ship, ship.position, ship.isRotated );
	//
	// 		return !ship.isCollision;
	// 	} );
	//
	// 	battlefield.destroy();
	//
	// 	return result;
	// }
}

export default CollisionInterface;
