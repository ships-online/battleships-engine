import { getSurroundingPositions } from 'battleships-utils/src/positions.js';

export default {
	/**
	 * Check if ship has a collision with other ships. For each ship which has a collision set
	 * {@link game.Ship#isCollision} as `true`. If ship has no collision set {@link game.Ship#isCollision} as `false`.
	 *
	 * @param {game.Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true` otherwise return `false`.
	 */
	checkShipCollision( ship ) {
		let isCollision = false;

		for ( const position of ship.coordinates ) {
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
 * Check if ship has collision with other ships at the same field.
 *
 * @private
 * @param {game.Ship} ship Ship instance.
 * @param {Array<{game.Item}>|null} field
 * @returns {boolean}
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
