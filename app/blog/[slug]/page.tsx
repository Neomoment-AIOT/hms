"use client";

import Header from "@/app/_components/header/page";
import Footer from "@/app/_components/footer/page";
import { useState, FormEvent, useContext, useEffect } from "react";
import { useParams } from "next/navigation";
import { LangContext } from "@/app/lang-provider";

type BlogSectionLayout = "left" | "right" | "full" | "text";

type BlogSection = {
  id: number;
  sequence: number;
  layout: BlogSectionLayout;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  image: string;
};

type BlogPost = {
  slug: string;
  titleEn: string;
  titleAr: string;
  date: string;
  time: string;
  comments: number;
  image: string;
  introEn: string;
  introAr: string;
  contentEn: string;
  contentAr: string;
  sections?: BlogSection[];
};

export default function BlogPostPage() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  const { slug } = useParams() as { slug: string };

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  type SavedComment = { id: number; name: string; message: string; date: string };
  const [savedComments, setSavedComments] = useState<SavedComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentStatus, setCommentStatus] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showComments, setShowComments] = useState(true);

  const loadComments = async () => {
    if (!slug) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/cms/blogs/comments?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: true; data: { comments: unknown } }
        | { ok: false; error?: string }
        | null;

      if (json?.ok) {
        const list = Array.isArray(json.data.comments) ? (json.data.comments as SavedComment[]) : [];
        setSavedComments(list);
        if (list.length > 0) setShowComments(true);
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(`/api/cms/blogs/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const json = (await res.json().catch(() => null)) as
          | { ok: true; data: Record<string, unknown> | null }
          | { ok: false; error?: string }
          | null;

        if (cancelled) return;

        if (!json?.ok || !json.data) {
          setNotFound(true);
          setBlog(null);
          return;
        }

        const d = json.data;
        setBlog({
          slug: String(d.slug || slug),
          titleEn: String(d.titleEn || d.title_en || ""),
          titleAr: String(d.titleAr || d.title_ar || ""),
          date: String(d.date || ""),
          time: String(d.time || ""),
          comments: Number(d.comments || 0),
          image: String(d.image || "/Blogs/Blog.jpeg"),
          introEn: String(d.introEn || d.intro_en || ""),
          introAr: String(d.introAr || d.intro_ar || ""),
          contentEn: String(
            d.contentEn || d.content_en || d.descriptionEn || d.description_en || ""
          ),
          contentAr: String(
            d.contentAr || d.content_ar || d.descriptionAr || d.description_ar || ""
          ),
          sections: Array.isArray((d as { sections?: unknown }).sections)
            ? ((d as { sections: Array<Record<string, unknown>> }).sections || []).map((s) => ({
                id: Number(s.id || 0),
                sequence: Number(s.sequence || 0),
                layout: String(s.layout || "left") as BlogSectionLayout,
                titleEn: String(s.titleEn || ""),
                titleAr: String(s.titleAr || ""),
                bodyEn: String(s.bodyEn || ""),
                bodyAr: String(s.bodyAr || ""),
                image: String(s.image || ""),
              }))
            : [],
        });
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setBlog(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (slug) loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const submitComment = (e: FormEvent) => {
    e.preventDefault();

    (async () => {
      setCommentStatus(null);
      try {
        const res = await fetch(`/api/cms/blogs/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, name, email, message }),
        });
        const json = (await res.json().catch(() => null)) as
          | { ok: true; message?: string }
          | { ok: false; error?: string }
          | null;

        if (!json?.ok) {
          setCommentStatus(json?.error || (ar ? "تعذر إرسال التعليق" : "Failed to submit comment"));
          return;
        }

        setCommentStatus(json.message || (ar ? "تم إرسال التعليق" : "Comment submitted"));
        setName("");
        setEmail("");
        setMessage("");
        setShowComments(true);
        await loadComments();
      } catch {
        setCommentStatus(ar ? "تعذر إرسال التعليق" : "Failed to submit comment");
      }
    })();
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-600">
        Blog Not Found
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* BANNER */}
      <div className="w-full relative">
        <div className="w-full h-56 md:h-80 lg:h-96 relative overflow-hidden">
          <img src={blog.image} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <h1
              className={`text-4xl font-bold text-white ${ar ? "font-arabic" : ""}`}
            >
              {ar ? blog.titleAr || blog.titleEn : blog.titleEn || blog.titleAr}
            </h1>
          </div>
        </div>
      </div>

      {/* META */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div
          className={`flex flex-wrap items-center justify-center gap-10 text-center ${
            ar ? "font-arabic" : ""
          }`}
        >
          <span>
            <strong>{ar ? "التاريخ:" : "Date:"}</strong> {blog.date}
          </span>

          <span>
            <strong>{ar ? "الوقت:" : "Time:"}</strong> {blog.time}
          </span>

          <span>
            <strong>{ar ? "التعليقات:" : "Comments:"}</strong>{" "}
            {commentsLoading ? blog.comments : savedComments.length}
          </span>
        </div>
      </div>

      {/* INTRO TEXT (above sections) */}
      {(() => {
        const intro = ar ? blog.introAr || blog.introEn : blog.introEn || blog.introAr;
        if (!intro) return null;
        return (
          <div className="max-w-[1200px] mx-auto px-4">
            <p className="text-gray-700 leading-7 text-center max-w-4xl mx-auto whitespace-pre-line">
              {intro}
            </p>
          </div>
        );
      })()}

      {/* CONTENT */}
      <div
        className={`max-w-[1200px] mx-auto px-4 py-6 leading-7 ${
          ar ? "font-arabic" : ""
        }`}
        dir={ar ? "rtl" : "ltr"}
      >
        {blog.sections && blog.sections.length > 0 ? (
          <div className="space-y-12">
            {blog.sections.map((s) => {
              const title = ar ? (s.titleAr || s.titleEn) : (s.titleEn || s.titleAr);
              const body = ar ? (s.bodyAr || s.bodyEn) : (s.bodyEn || s.bodyAr);
              const hasImg = Boolean(s.image);

              if (s.layout === "full") {
                return (
                  <section key={s.id} className="space-y-6">
                    {hasImg && (
                      <div className="flex justify-center">
                        <img
                          src={s.image}
                          alt={title || "Section image"}
                          className="w-full max-w-5xl rounded-lg shadow-md object-cover"
                        />
                      </div>
                    )}
                    {title && (
                      <h2 className="text-2xl font-bold text-[#066f73]">
                        {title}
                      </h2>
                    )}
                    {body && <p className="text-gray-700 leading-7">{body}</p>}
                  </section>
                );
              }

              if (s.layout === "text" || !hasImg) {
                return (
                  <section key={s.id} className="space-y-4">
                    {title && (
                      <h2 className="text-2xl font-bold text-[#066f73]">
                        {title}
                      </h2>
                    )}
                    {body && <p className="text-gray-700 leading-7">{body}</p>}
                  </section>
                );
              }

              const imageFirst = s.layout === "left";
              return (
                <section
                  key={s.id}
                  className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center ${
                    !imageFirst ? "md:grid-cols-[1.5fr_1fr]" : ""
                  }`}
                >
                  {imageFirst ? (
                    <>
                      <div className="flex justify-center">
                        <img
                          src={s.image}
                          alt={title || "Section image"}
                          className="rounded-lg shadow-md object-cover w-[320px] max-w-full"
                        />
                      </div>
                      <div className={ar ? "text-right" : "text-left"}>
                        {title && (
                          <h2 className="text-2xl font-bold text-[#066f73] mb-3">
                            {title}
                          </h2>
                        )}
                        {body && (
                          <p className="text-gray-700 leading-7">{body}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={ar ? "text-right" : "text-left"}>
                        {title && (
                          <h2 className="text-2xl font-bold text-[#066f73] mb-3">
                            {title}
                          </h2>
                        )}
                        {body && (
                          <p className="text-gray-700 leading-7">{body}</p>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={s.image}
                          alt={title || "Section image"}
                          className="rounded-lg shadow-md object-cover w-[320px] max-w-full"
                        />
                      </div>
                    </>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: ar ? blog.contentAr || blog.contentEn : blog.contentEn || blog.contentAr,
            }}
          />
        )}
      </div>

      {/* COMMENTS */}
      <div className="max-w-[1200px] mx-auto px-4 my-10">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className={`text-xl font-semibold mb-4 ${ar ? "font-arabic" : ""}`}>
            {ar ? "اترك تعليقًا" : "Leave a Comment"}
          </h2>

          <form onSubmit={submitComment} className="space-y-4">
            <input
              type="text"
              placeholder={ar ? "اسمك" : "Your name"}
              className={`w-full p-2 border rounded bg-gray-100 ${
                ar ? "font-arabic text-right" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder={ar ? "بريدك الإلكتروني" : "Your email"}
              className={`w-full p-2 border rounded bg-gray-100 ${
                ar ? "font-arabic text-right" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              rows={5}
              placeholder={ar ? "اكتب تعليقك..." : "Write your comment..."}
              className={`w-full p-2 border rounded bg-gray-100 ${
                ar ? "font-arabic text-right" : ""
              }`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-6 py-2 rounded-md">
              {ar ? "إرسال" : "Submit"}
            </button>

            {commentStatus && (
              <p className="text-sm text-gray-600">{commentStatus}</p>
            )}
          </form>
        </div>
      </div>

      {/* DISPLAY COMMENTS */}
      {showComments && (
        <div className="max-w-[1200px] mx-auto px-4 mb-10">
          <h2 className={`text-xl font-semibold mb-4 ${ar ? "font-arabic" : ""}`}>
            {ar
              ? `التعليقات (${savedComments.length})`
              : `Comments (${savedComments.length})`}
          </h2>

          {commentsLoading ? (
            <div className="text-sm text-gray-500 mb-3">
              {ar ? "جارٍ التحميل..." : "Loading..."}
            </div>
          ) : null}

          {savedComments.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-md shadow mb-3">
              <p className="font-semibold">
                {c.name} • {c.date}
              </p>
              <p className={`${ar ? "font-arabic text-right" : ""}`}>{c.message}</p>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </>
  );
}
