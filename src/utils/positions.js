/**
 * Get position at the top of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopOf( position ) {
	return [ position[ 0 ], position[ 1 ] - 1 ];
}

/**
 * Get position at the right of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheRightOf( position ) {
	return [ position[ 0 ] + 1, position[ 1 ] ];
}

/**
 * Get position at the bottom of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomOf( position ) {
	return [ position[ 0 ], position[ 1 ] + 1 ];
}

/**
 * Get position at the left of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheLeftOf( position ) {
	return [ position[ 0 ] - 1, position[ 1 ] ];
}

/**
 * Get position at the top right of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopRightOf( position ) {
	return getPositionAtTheRightOf( getPositionAtTheTopOf( position ) );
}

/**
 * Get position at the bottom right of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomRightOf( position ) {
	return getPositionAtTheRightOf( getPositionAtTheBottomOf( position ) );
}

/**
 * Get position at the bottom left of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomLeftOf( position ) {
	return getPositionAtTheLeftOf( getPositionAtTheBottomOf( position ) );
}

/**
 * Get position at the top left of passed position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopLeftOf( position ) {
	return getPositionAtTheLeftOf( getPositionAtTheTopOf( position ) );
}

/**
 * Get surrounding position at the top left of passed position.
 *
 * @param position
 * @returns {Array<Array>}
 */
export function getSurroundingPositions( position ) {
	return [
		getPositionAtTheTopOf( position ),
		getPositionAtTheTopRightOf( position ),
		getPositionAtTheRightOf( position ),
		getPositionAtTheBottomRightOf( position ),
		getPositionAtTheBottomOf( position ),
		getPositionAtTheBottomLeftOf( position ),
		getPositionAtTheLeftOf( position ),
		getPositionAtTheTopLeftOf( position )
	];
}
