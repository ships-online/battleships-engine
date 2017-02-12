import { getSurroundingPositions } from '../utils/positions.js';

/**
 * Injects the collision checking API into host Battlefield.
 *
 * @interface CollisionInterface
 */
const CollisionInterface = {
	/**
	 * Checks if ship has a collision with other ships on the battlefield.
	 *
	 * @param {Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true` otherwise return `false`.
	 */
	checkShipCollision( ship ) {
		let isCollision = false;

		for ( const position of ship.getCoordinates() ) {
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
	},

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
};

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

export default CollisionInterface;
