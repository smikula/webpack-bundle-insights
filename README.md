# webpack-bundle-insights

Webpack-bundle insights is a collection of tools and utilities to help make sense of [Webpack](https://webpack.js.org/) bundle compilation results.  It consumes the output of [webpack-bundle-stats-plugin](https://github.com/smikula/webpack-bundle-stats-plugin).

## BundleGraphExplorer

`BundleGraphExplorer` allows you to walk your bundle graph, loading bundles one by one, and understand the impact of each.

```typescript
<BundleGraphExplorer stats={stats} className={cssClass} />
```

**Properties:**
- `stats`: a `BundleStats` object produced by `webpack-bundle-stats-plugin`
- `className`: a CSS class to apply to the root element of the control.  For the control to lay out correctly, this should create a positioning context (e.g. `position: absolute` or `position: relative`).