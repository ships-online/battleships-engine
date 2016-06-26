/**
 * Copies enumerable properties and symbols from the objects given as 2nd+ parameters to the
 * prototype of first object (a constructor).
 *
 *		class SomeClass {
 *			...
 *		}
 *
 *		const SomeMixin = {
 *			a() {
 *				return 'a';
 *			}
 *		};
 *
 *		mix( SomeClass, SomeMixin, ... );
 *
 *		new SomeClass().a(); // -> 'a'
 *
 * Note: Properties which already exist in the base class will not be overridden.
 *
 * @memberOf utils
 * @param {Function} [baseClass] Class which prototype will be extended.
 * @param {Object} [...mixins] Objects from which to get properties.
 */
export default function mix( baseClass, ...mixins ) {
	mixins.forEach( ( mixin ) => {
		Object.getOwnPropertyNames( mixin ).concat( Object.getOwnPropertySymbols( mixin ) )
			.forEach( ( key ) => {
				if ( key in baseClass.prototype ) {
					return;
				}

				const sourceDescriptor = Object.getOwnPropertyDescriptor( mixin, key );
				sourceDescriptor.enumerable = false;

				Object.defineProperty( baseClass.prototype, key, sourceDescriptor );
			} );
	} );
}
