import { NewsHeader } from "@/components/news/NewsHeader";
import { NewsFooter } from "@/components/news/NewsFooter";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewsHeader />
      <main>{children}</main>
      <NewsFooter />
      <ScrollToTop />
    </>
  );
}
