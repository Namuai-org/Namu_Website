import { BlogCarousel } from "@/components/landing/BlogCarousel";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";

export default function BlogPage() {
  return (
    <>
      <NavBar />
      <section className="section" style={{ paddingTop: "110px" }}>
        <BlogCarousel />
      </section>
      <Footer />
    </>
  );
}
