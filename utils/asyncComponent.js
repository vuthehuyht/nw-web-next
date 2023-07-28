import dynamic from "next/dynamic";

export default function asyncComponent(
  importComponent,
  skeletonComponent,
  ssr = true
) {
  return dynamic(importComponent, {
    loading: () => skeletonComponent,
    ssr,
  });
}
