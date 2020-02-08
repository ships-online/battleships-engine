import Battlefield from '../battlefield';
import Position from '../../position';
import CollisionInterface from './collisioninterface';
import mix from 'js-utils/src/mix';
import { random } from 'lodash';

interface RandomInterface extends Battlefield, CollisionInterface {}

/**
 * Injects the randomize API into host Battlefield.
 */
class RandomInterface {
	random(): void {
		if ( this.isLocked ) {
			return;
		}

		for ( const ship of this._ships ) {
			ship.position = null;
		}

		this._fields.clear();

		const maxSize = this.size - 1;

		for ( const ship of Array.from( this._ships ).reverse() ) {
			let done = false;
			let attempts = 0;

			while ( !done ) {
				const isRotated = !!random( 0, 1 );
				const x = random( 0, maxSize );
				const y = random( 0, maxSize );

				this.moveShip( ship, new Position( x, y ), isRotated );

				if ( attempts++ < 100 ) {
					done = !this.checkCollision( ship );
				} else {
					this.checkCollision( ship );
					done = true;
				}
			}
		}
	}
}

mix( RandomInterface, CollisionInterface );

export default RandomInterface;
