export default {
	shoot( position ) {
		const field = this.getField( position );
		const result = { position };

		if ( !field ) {
			this.setMissed( position );
			result.type = 'missed';
		} else if ( field.isMissed || field.isHit ) {
			result.type = 'notEmpty';
		} else {
			const ship = field.getFirstShip();

			ship.setDamage( position );
			this.setHit( position );
			result.type = 'hit';

			if ( ship.isSunk ) {
				this.fire( 'shipSunk', ship );
				result.sunk = ship;
			}
		}

		return result;
	}
};
