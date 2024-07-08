# safe-return
TypeScript safe error returns without throwing exceptions

[![JSR](https://jsr.io/badges/@americanpelican/safe-return)](https://jsr.io/@americanpelican/safe-return) [![JSR Score](https://jsr.io/badges/@americanpelican/safe-return/score)](https://jsr.io/@americanpelican/safe-return)

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