import random from '@ckeditor/ckeditor5-utils/src/lib/lodash/random';

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

		for ( const ship of Array.from( this.shipsCollection ).reverse() ) {
			let done = false;
			let attempts = 0;

			while ( !done ) {
				const isRotated = !!random( 0, 1 );
				const x = random( 0, this.size - 1 );
				const y = random( 0, this.size - 1 );

				this.moveShip( ship, [ x, y ], isRotated );
				this.verifyExistingCollisions();

				if ( attempts++ < 100 ) {
					done = !this.checkShipCollision( ship );
				} else {
					this.checkShipCollision( ship );
					done = true;
				}
			}
		}
	}
};

export default RandomInterface;
