/**
 * Returns random number from the given range.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export default function random( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}
