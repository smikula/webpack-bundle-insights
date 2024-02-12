# unshadowed-modules

The purpose of `analyzeShadowedModules` is to explore why a module is included in a bundle when we expect it to be excluded because it is "shadowed" — included in some parent bundle(s) so that it should not be necessary to include here.  It means there must be _some_ path from a root to this bundle where the module is _not_ included.  This function will print out such paths.

Next steps:
- Clean up `EnhancedBundleStats` by implementing `EnhancedChunkGroup`, etc.
- Find a case where this actually helps.
- Figure out how to share it with people?  Ninja?  Build script
    - It would be nice to visualize the graph instead of just printing out paths
- Stretch goal: see if there's any way to account for cache groups, which always seem to be the confounding factor.
