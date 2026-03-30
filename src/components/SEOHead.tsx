
export default function SEOHead({ title, description, canonical, keywords }: any) {
  // In Next.js App router, we define metadata per page. This component handles client side title injection if needed,
  // but SSR requires page.tsx to export const metadata
  return (
    <title>{title}</title>
  );
}
    