# safe-return
TypeScript safe error returns without throwing exceptions

## Promise Example

```ts
export async function storeFactory (model: CORE.Model, resolverMap?: Record<CORE.IRI, Resolver> | undefined, resolvers?: Array<Resolver> | undefined): Promise<Safe<Store>> {
	let store: Store

	try {
		store = new Store(model, resolverMap, resolvers)

		return {success: true, data: store}
	}
	catch (e) {
		return { success: false, error: `> store ${ERROR.getErrorMsg(e)}` }
	}
}
```