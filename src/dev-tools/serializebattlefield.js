/**
 * Serializes battlefield to JSON format.
 * It is useful to dump battlefield on console e.g.:
 *
 * 		const battlefield = new Battlefield();
 * 		console.table( serializeBattlefield( battlefield ) );
 *
 * @param {Battlefield} battlefield Battlefield instance.
 * @returns {Object} Serialized battlefield.
 */
export default function serializeBattlefield( battlefield ) {
	const result = {};

	for ( let y = 0; y < battlefield.size; y++ ) {
		let row = {};

		for ( let x = 0; x < battlefield.size; x++ ) {
			const field = battlefield.getField( [ x, y ] );

			row[ x ] = field ? Array.from( field ).map( ship => ship.id ).join( ',' ) : '';
		}

		result[ y ] = row;
	}

	return result;
}
