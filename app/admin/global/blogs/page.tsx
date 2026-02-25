"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaUndo, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import ImageUploadModal from "../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../_lib/adminStorage";

interface BlogItem {
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  date: string;
  time: string;
  comments: number;
  image: string;
}

const defaultBlogs: BlogItem[] = [
  {
    slug: "5-tips-to-find-the-best-hotels-in-makkah",
    titleEn: "5 Tips to find the best hotels in Makkah",
    titleAr: "٥ نصائح للعثور على أفضل الفنادق في مكة",
    descriptionEn: "Discover the best strategies for finding comfortable and affordable hotels in Makkah.",
    descriptionAr: "اكتشف أفضل الاستراتيجيات للعثور على فنادق مريحة وبأسعار معقولة في مكة.",
    date: "2025-01-15",
    time: "5 min read",
    comments: 12,
    image: "/Blogs/Blog.jpeg",
  },
  {
    slug: "how-to-check-hotel-reviews",
    titleEn: "How to Check Hotel Reviews Before Booking",
    titleAr: "كيف تتحقق من تقييمات الفنادق قبل الحجز",
    descriptionEn: "Learn how to evaluate hotel reviews and make the best booking decision.",
    descriptionAr: "تعلم كيفية تقييم مراجعات الفنادق واتخاذ أفضل قرار حجز.",
    date: "2025-01-10",
    time: "4 min read",
    comments: 8,
    image: "/Blogs/Check.jpeg",
  },
  {
    slug: "compare-hotel-prices",
    titleEn: "Compare Hotel Prices Like a Pro",
    titleAr: "قارن أسعار الفنادق مثل المحترفين",
    descriptionEn: "Tips and tricks for comparing hotel prices to get the best deals.",
    descriptionAr: "نصائح وحيل لمقارنة أسعار الفنادق للحصول على أفضل العروض.",
    date: "2025-01-05",
    time: "6 min read",
    comments: 5,
    image: "/Blogs/Compare.jpeg",
  },
];

export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>(defaultBlogs);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBlogs(getAdminData(STORAGE_KEYS.GLOBAL_BLOGS, defaultBlogs));
  }, []);

  const handleSave = () => {
    setAdminData(STORAGE_KEYS.GLOBAL_BLOGS, blogs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(STORAGE_KEYS.GLOBAL_BLOGS);
    setBlogs(defaultBlogs);
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    setBlogs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newBlog: BlogItem = {
      slug: `new-blog-${Date.now()}`,
      titleEn: "New Blog Post",
      titleAr: "مقال جديد",
      descriptionEn: "Enter blog description...",
      descriptionAr: "أدخل وصف المقال...",
      date: new Date().toISOString().split("T")[0],
      time: "3 min read",
      comments: 0,
      image: "/Blogs/Blog.jpeg",
    };
    setBlogs((prev) => [...prev, newBlog]);
    setEditIndex(blogs.length);
  };

  const updateBlog = (index: number, field: keyof BlogItem, value: string | number) => {
    setBlogs((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage blog images and metadata.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
          >
            <FaUndo size={12} />
            Reset
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
          >
            <FaPlus size={12} />
            Add Blog
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.map((blog, i) => (
          <div
            key={blog.slug}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div
                className="sm:w-48 h-36 sm:h-auto shrink-0 relative group cursor-pointer"
                onClick={() => setUploadIndex(i)}
              >
                <img
                  src={blog.image}
                  alt={blog.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded">
                    Replace
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                {editIndex === i ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={blog.titleEn}
                        onChange={(e) => updateBlog(i, "titleEn", e.target.value)}
                        placeholder="Title (English)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={blog.titleAr}
                        onChange={(e) => updateBlog(i, "titleAr", e.target.value)}
                        placeholder="Title (Arabic)"
                        dir="rtl"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <textarea
                        value={blog.descriptionEn}
                        onChange={(e) => updateBlog(i, "descriptionEn", e.target.value)}
                        placeholder="Description (English)"
                        rows={2}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <textarea
                        value={blog.descriptionAr}
                        onChange={(e) => updateBlog(i, "descriptionAr", e.target.value)}
                        placeholder="Description (Arabic)"
                        dir="rtl"
                        rows={2}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={blog.slug}
                        onChange={(e) => updateBlog(i, "slug", e.target.value)}
                        placeholder="Slug"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="date"
                        value={blog.date}
                        onChange={(e) => updateBlog(i, "date", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      Done Editing
                    </button>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {blog.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {blog.descriptionEn}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{blog.date}</span>
                      <span>{blog.time}</span>
                      <span>/{blog.slug}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center justify-center gap-2 p-3 border-t sm:border-t-0 sm:border-l border-gray-100">
                <button
                  onClick={() => setEditIndex(editIndex === i ? null : i)}
                  className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                >
                  {editIndex === i ? <FaTimes size={14} /> : <FaEdit size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          Save All Changes
        </button>
        {saved && (
          <span className="text-sm text-green-600">Saved successfully!</span>
        )}
      </div>

      {/* Image Upload Modal */}
      {uploadIndex !== null && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setUploadIndex(null)}
          onUpload={(base64) => {
            updateBlog(uploadIndex, "image", base64);
            setUploadIndex(null);
          }}
          currentImage={blogs[uploadIndex]?.image}
          title="Replace Blog Image"
        />
      )}
    </div>
  );
}
