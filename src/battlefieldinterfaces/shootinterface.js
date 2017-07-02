/**
 * Injects the shoot API into host Battlefield.
 *
 * @interface ShootInterface
 */
const ShootInterface = {
	/**
	 * Take a shoot.
	 *
	 * @param {Array<Number, Number>} position Position on the Battlefield.
	 * @returns {Object} Shoot summary.
	 */
	shoot( position ) {
		const field = this.getField( position );
		const result = { position };

		if ( !field ) {
			this.markAsMissed( position );
			result.type = 'missed';
		} else if ( field.isMissed || field.isHit ) {
			result.type = field.isMissed ? 'missed' : 'hit';
			result.notEmpty = true;
		} else {
			const ship = field.getFirstShip();

			ship.setDamage( position );
			this.markAsHit( position );
			result.type = 'hit';

			if ( ship.isSunk ) {
				this.fire( 'shipSunk', ship );
				result.sunk = ship;
			}
		}

		return result;
	}
};

export default ShootInterface;
