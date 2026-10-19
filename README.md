# builtin.prettier

## Settings

`prettier.useFileWatcher` defaults to `true`. On supported local filesystems,
Prettier watches configuration search directories and reuses discovery until a
configuration changes. Set it to `false` to look up configuration on every
format. Web hosts, virtual URIs and unavailable watchers use fresh lookups.

## Contributing

```sh
git clone git@github.com:lvce-editor/prettier.git &&
cd prettier &&
npm ci &&
npm test
```
