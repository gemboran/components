# UI Buatan

[shadcn-ui v2.0](https://ui.shadcn.com/docs/changelog) introduced the possibility of fetching components from custom
registries, that's why this components book was born.

## Components

As did by [shadcn-ui](https://github.com/shadcn-ui/ui), components are organized by styles under the `registry` folder.
But I modify the structure, files are structured as follows:

```bash
registry
├── components
├──── atoms
├──── molecules
├──── organisms
├──── templates
├──── pages
├── hooks
└── lib
```

## Adding new components.

1. As did for the [button](components/atoms/button.tsx), add your component under the [components](components)
   folder ([lib](lib) for lib and [hooks](hooks) for hook).
2. Write a story on `registry/<type>/<scope>/<name>.stories.tsx` for components and `registry/<type>/<name>.stories.tsx`
   for hook and lib (e.g. [button.stories.tsx](registry/components/atoms/button.stories.tsx))
3. Run `pnpm build:registry` to generate the registry file.

## Installing custom components

You can install your custom components by running 

```bash
npx shadcn-ui@latest add {.storybook-url}/r/{component-id}.json
```

## Running the app locally
This app simple homepage was thought for simplify the process of building the registry url. 

In order to see it in action locally, run `pnpm dev` and navigate to `http://localhost:6006`.


## Deploy it on Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ilyichv/shadcn-registry-template)
