export default {
	shoot( position ) {
		const field = this.get( position );
		const result = { position, type: 'missed' };

		if ( !field ) {
			this.setMissed( position );

			return result;
		}

		if ( field.isMissed ) {
			return result;
		}

		if ( field.isHit ) {
			result.type = 'hit';
		}

		const ship = field.getFirstShip();

		this.setHit( position );
		ship.setDamage( position );
		result.type = 'hit';

		if ( ship.isSunk ) {
			this.fire( 'shipSunk', ship );
			result.sunk = ship;
		}

		return result;
	}
};
