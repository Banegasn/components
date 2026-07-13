const workspace =
  process.argv[2] ?? process.env.npm_package_name ?? 'workspace';

console.log(
  `[test] ${workspace}: no automated tests yet; tracked explicitly by GitHub issue #12.`,
);
