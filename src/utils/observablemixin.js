import EmitterMixin from './emittermixin.js';

const attributesSymbol = Symbol( 'attributes' );

/**
 * Mixin injects the `observable attributes`.
 * Emits `change:property` event for each change of attribute created by a `set()` method.
 *
 * @mixin
 * @mixes utils.EmitterMixin
 * @memberOf utils
 */
const ObservableMixin = {
	/**
	 * Creates and sets the value of an observable attribute of this object. Such an attribute becomes a part
	 * of the state and is be observable.
	 *
	 * It accepts also a single object literal containing key/value pairs with attributes to be set.
	 *
	 * This method throws the Error if the observable instance already
	 * have a property with a given attribute name. This prevents from mistakenly overriding existing
	 * properties and methods, but means that `foo.set( 'bar', 1 )` may be slightly slower than `foo.bar = 1`.
	 *
	 * @method utils.ObservableMixin#set
	 * @param {String} name The attributes name.
	 * @param {*} value The attributes value.
	 */
	set( name, value ) {
		// If the first parameter is an Object, iterate over its properties.
		if ( isObject( name ) ) {
			Object.keys( name ).forEach( ( attr ) => {
				this.set( attr, name[ attr ] );
			}, this );

			return;
		}

		if ( !( attributesSymbol in this ) ) {
			// The internal hash containing the observable's state.
			//
			// @private
			// @type {Map}
			Object.defineProperty( this, attributesSymbol, {
				value: new Map()
			} );
		}

		const attributes = this[ attributesSymbol ];

		if ( ( name in this ) && !attributes.has( name ) ) {
			/**
			 * Cannot override an existing property.
			 *
			 * This error is thrown when trying to {@link utils.Observable#set set} an attribute with
			 * a name of an already existing property. For example:
			 *
			 *		let observable = new Model();
			 *		observable.property = 1;
			 *		observable.set( 'property', 2 );	// throws
			 *
			 *		observable.set( 'attr', 1 );
			 *		observable.set( 'attr', 2 );		// ok, because this is an existing attribute.
			 */
			throw new Error( 'Cannot override an existing property.' );
		}

		Object.defineProperty( this, name, {
			enumerable: true,
			configurable: true,

			get() {
				return attributes.get( name );
			},

			set( value ) {
				const oldValue = attributes.get( name );

				// Allow undefined as an initial value like A.define( 'x', undefined ) (#132).
				// Note: When attributes map has no such own property, then its value is undefined.
				if ( oldValue !== value || !attributes.has( name ) ) {
					attributes.set( name, value );
					this.emit( `change:${ name }`, name, value, oldValue );
				}
			}
		} );

		this[ name ] = value;
	}
};

Object.assign( ObservableMixin, EmitterMixin );

export default ObservableMixin;

/**
 * Checks if `value` is the type of Object.
 *
 * @private
 * @param {*} value
 * @returns {boolean}
 */
function isObject( value ) {
	const type = typeof value;

	return !!value && ( type == 'object' || type == 'function' );
}
