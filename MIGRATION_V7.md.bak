# Migration Guide: react-final-form v6 → v7

## Overview

Version 7.0.0 includes a complete TypeScript rewrite (migrated from Flow). While the runtime behavior remains largely unchanged, there are several TypeScript-specific breaking changes you need to be aware of.

## Breaking Changes

### 1. FormState Properties Now Optional

In v7.0.0, most FormState boolean properties can be `undefined`:

**❌ Before (v6.x):**

```typescript
const { dirty, pristine, valid } = formState;
if (dirty && !pristine) { // Works fine
  // ...
}
```

**✅ After (v7.0.0):**

```typescript
const { dirty, pristine, valid } = formState;
if ((dirty ?? false) && !(pristine ?? true)) { // Must handle undefined
  // ...
}
```

**Affected properties:**
- `dirty`, `pristine`, `valid`, `invalid`
- `dirtySinceLastSubmit`, `modifiedSinceLastSubmit`
- `submitFailed`, `submitSucceeded`, `submitting`, `validating`
- `hasSubmitErrors`, `hasValidationErrors`

**Note:** `values` is still guaranteed to be defined.

### 2. FieldMetaState Type No Longer Exported

**❌ Before (v6.x):**

```typescript
import { FieldMetaState } from 'react-final-form';

const meta: FieldMetaState = { /* ... */ };
```

**✅ After (v7.0.0):**

```typescript
import { FieldRenderProps } from 'react-final-form';

const meta: FieldRenderProps<any>['meta'] = { /* ... */ };

// Or define it locally:
type FieldMetaState = {
  active?: boolean;
  data?: Record<string, any>;
  dirty?: boolean;
  // ... etc
};
```

### 3. AnyObject Type No Longer Exported

**❌ Before (v6.x):**

```typescript
import { AnyObject } from 'react-final-form';
```

**✅ After (v7.0.0):**

```typescript
// Define locally:
type AnyObject = Record<string, any>;
```

### 4. UseFieldConfig No Longer Generic

**❌ Before (v6.x):**

```typescript
const config: UseFieldConfig<string> = {
  validate: (value) => value ? undefined : 'Required'
};
```

**✅ After (v7.0.0):**

```typescript
const config: UseFieldConfig = {
  validate: (value) => value ? undefined : 'Required'
};
```

### 5. FormProps No Longer Accepts Arbitrary Props

In v6.x, you could pass arbitrary props (like `style`, `className`) directly to `<Form>`. In v7.0.0, this is no longer supported due to stricter TypeScript typing.

**❌ Before (v6.x):**

```tsx
<Form
  onSubmit={handleSubmit}
  style={{ padding: '20px' }}
  className="my-form"
>
  {/* ... */}
</Form>
```

**✅ After (v7.0.0):**

```tsx
<Form onSubmit={handleSubmit}>
  {({ handleSubmit }) => (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }} className="my-form">
      {/* ... */}
    </form>
  )}
</Form>

// Or wrap in a div:
<div style={{ padding: '20px' }} className="my-form">
  <Form onSubmit={handleSubmit}>
    {/* ... */}
  </Form>
</div>
```

## final-form v5.0.0 Changes

If you're also upgrading final-form to v5.0.0, be aware of these changes:

### 1. InternalFormState Requires asyncErrors

**❌ Before (v4.x):**

```typescript
const mockFormState: InternalFormState = {
  values: {},
  // ...
};
```

**✅ After (v5.0.0):**

```typescript
const mockFormState: InternalFormState = {
  values: {},
  asyncErrors: {}, // Now required
  // ...
};
```

### 2. Mutator Type Signature Changed

**❌ Before (v4.x):**

```typescript
const mutator: Mutator = (args, state, tools) => {
  // ...
};
```

**✅ After (v5.0.0):**

```typescript
// If you get type errors with existing mutators:
const mutator = ((args, state, tools) => {
  // ...
}) as unknown as Mutator;
```

## Migration Strategy

For a medium to large codebase, expect to modify 100+ files. Here's a recommended approach:

1. **Update dependencies:**

   ```bash
   npm install react-final-form@^7.0.0 final-form@^5.0.0
   ```

2. **Fix compilation errors in this order:**
   - Handle optional boolean properties (use `?? false` or `?? true`)
   - Replace `FieldMetaState` imports with `FieldRenderProps['meta']`
   - Replace `AnyObject` imports with local type definition
   - Remove generic from `UseFieldConfig<T>` → `UseFieldConfig`
   - Fix `<Form>` props (move styling to wrapper or inner `<form>`)

3. **Test thoroughly:**
   - All form submissions
   - Validation behavior
   - Field state management
   - Meta information display

4. **Update mocks/tests:**
   - Add `asyncErrors: {}` to InternalFormState mocks
   - Cast mutators if needed

## Need Help?

If you encounter issues during migration:

1. Check the [TypeScript examples](https://github.com/final-form/react-final-form/tree/main/examples/typescript)
2. Review [closed issues](https://github.com/final-form/react-final-form/issues?q=is%3Aissue+typescript)
3. Open a [new issue](https://github.com/final-form/react-final-form/issues/new) with a reproduction

## Benefits of v7.0.0

Despite the migration effort, v7.0.0 brings significant benefits:

- **Better TypeScript support** - First-class TypeScript instead of generated types from Flow
- **Improved type inference** - Better autocomplete and type checking
- **Modern codebase** - Easier for contributors to work with
- **Long-term maintainability** - TypeScript ecosystem is more active than Flow

---

**Version**: 7.0.0  
**Last Updated**: 2026-02-13
