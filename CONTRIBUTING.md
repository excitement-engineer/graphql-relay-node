## Release on NPM

_Only core contributors may release to NPM._

To release a new version on NPM, first ensure all tests pass with `npm test`,
then use `npm version patch|minor|major` in order to increment the version in
package.json and tag and commit a release. Then `git push && git push --tags`
this change so Travis CI can deploy to NPM. _Do not run `npm publish` directly._
Once published, add [release notes](https://github.com/excitement-engineer/graphql-iso-date/tags).
Use [semver](http://semver.org/) to determine which version part to increment.

Example for a patch release:

```sh
npm test
npm version patch
git push --follow-tags
```
