# Installation

To use Manta-Style, add the packages to your project.

The common package you will always need is the CLI.
Then depending on which type system and mock plugins you will use, you will add specific packages as plugins.

## CLI

```sh
npm install --save-dev @manta-style/cli
```

<!--

global install issue:
cannot link the builder plugin if built globally

commenting this part of the docs out for now

To install globally

```
npm install -g @manta-style/cli
```

This adds a command line tool `ms` to your system.
-->

## Builders

Manta Style supports generation of mock data from different typing systems via binding builders.
You need to add the corresponding builder plugin to your project.

```sh
npm install --save-dev @manta-style/builder-typescript
```

Check out docs on [builder plugins](#) for more information on currently supported builders and for information on implementing your own type systems.

### Plugins

Manta Style supports a handful of data generating features via plugins.
One major example is `@manta-style/mock-faker`. This is a plugin that enables you to generate fake datas that look real.

You could check [Plugins](#plugins) for the usages of official plugins. You could make our own plugins as well.
