import random from '../utils/random.js';

/**
 * Injects the randomize API into host Battlefield.
 *
 * @interface RandomInterface
 */
const RandomInterface = {
	random() {
		if ( this.isLocked ) {
			return;
		}

		for ( const ship of this.shipsCollection ) {
			ship.position = [ null, null ];
		}

		this._fields.clear();

		for ( const ship of this.shipsCollection.getReversed() ) {
			let done = false;

			while ( !done ) {
				const isRotated = !!random( 0, 1 );
				const x = random( 0, this.size - 1 );
				const y = random( 0, this.size - 1 );

				this.moveShip( ship, [ x, y ], isRotated );
				this.verifyExistingCollisions();
				done = !this.checkShipCollision( ship );
			}
		}
	}
};

export default RandomInterface;
