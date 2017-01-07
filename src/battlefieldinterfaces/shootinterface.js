export default {
	shoot( position ) {
		const field = this.get( position );

		if ( !field ) {
			this.setMissed( position );
		} else if ( field.length && !field.isHit ) {
			const ship = field.getFirstShip();

			this.setHit( position );
			ship.setDamage( position );

			if ( ship.isSunk ) {
				this.fire( 'shipSunk', ship );
			}
		}
	}
}
