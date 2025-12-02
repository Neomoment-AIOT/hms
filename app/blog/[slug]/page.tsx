"use client";

import Header from "@/app/components/header/page";
import Footer from "@/app/components/footer/page";
import { useState, FormEvent, use } from "react";

export default function BlogPostPage({ params }: any) {
  const { slug } = use<{ slug: string }>(params);

  // ⭐ ALL BLOGS HERE
  const blogs = [
    {
      slug: "5-tips-to-find-the-best-hotels-in-makkah",
      title: "5 Tips to find the best hotels in Makkah",
      date: "12 Oct 2025",
      time: "12:00 pm",
      image: "/Blogs/Blog.jpeg",

      content: `
<div class="space-y-12">

  <p class="text-gray-700 leading-7 text-center max-w-4xl mx-auto">
    Finding the best hotels in Makkah requires careful and strategic planning to balance comfort, convenience, and affordability. With the city attracting millions of pilgrims each year, choosing the right accommodation near the Holy Mosque can significantly enhance your overall experience. Factors such as proximity to Al-Masjid al-Haram, amenities, transportation options, and budget play a crucial role in making an informed decision. By comparing hotel ratings, reviews, and seasonal offers, travelers can find the perfect stay that meets their spiritual and practical needs during their visit to Makkah.
  </p>

  <!-- SECTION 1 (IMAGE LEFT) -->
  <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">

    <div class="flex justify-center">
      <img src="/Blogs/Consider.jpeg" 
        class="rounded-lg shadow-md object-cover"
        style="width:320px; height:auto;" />
    </div>

    <div>
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">Consider the Distance</h2>
      <p class="text-gray-700 leading-7">
       Finding the best hotels in Makkah requires careful and strategic planning to balance comfort, convenience, and affordability. With the city attracting millions of pilgrims each year, choosing the right accommodation near the Holy Mosque can significantly enhance your overall experience. Factors such as proximity to Al-Masjid al-Haram, amenities, transportation options, and budget play a crucial role in making an informed decision.
      </p>
    </div>

  </div>

  <!-- SECTION 2 (IMAGE RIGHT) -->
  <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">

    <div>
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">
        Compare Hotel Amenities and Services
      </h2>

      <p class="text-gray-700 leading-7">
        Choosing a hotel close to Al-Masjid al-Haram can save time and energy,
        especially during peak seasons or prayer times. Staying nearby offers
        convenience and easy access to the Haram, which is ideal for elderly
        pilgrims or families. However, hotels near the mosque tend to be more
        expensive and can get crowded.
      </p>
    </div>

    <div class="flex justify-center">
      <img 
        src="/Blogs/Compare.jpeg"
        class="rounded-lg shadow-md object-cover"
        style="width:320px; height:auto;" 
      />
    </div>

  </div>

  <!-- SECTION 3 (IMAGE LEFT) -->
  <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">

    <div class="flex justify-center">
      <img src="/Blogs/Check.jpeg"
        class="rounded-lg shadow-md object-cover"
        style="width:320px; height:auto;" />
    </div>

    <div>
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">Check Reviews and Ratings</h2>
      <p class="text-gray-700 leading-7">
       Reading guest reviews and checking hotel ratings on trusted platforms can give you real insights into cleanliness, service quality, and amenities. The benefit of this approach is that it helps you avoid unpleasant surprises and ensures you get what you pay for. On the downside, some reviews can be biased or outdated, so it’s wise to read a mix of recent and detailed reviews for a balanced perspective.
      </p>
    </div>

  </div>

  <!-- SECTION 4 (IMAGE RIGHT) -->
  <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">

    <div>
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">
        Evaluate Amenities and Services
      </h2>

      <p class="text-gray-700 leading-7">
        Before booking, check what facilities the hotel provides, such as free Wi-Fi, 
        shuttle services to the Haram, on-site dining, or prayer areas. These amenities 
        can greatly enhance comfort and convenience during your stay. The advantage of 
        prioritizing such services is that they save time and effort, allowing you to 
        focus more on your pilgrimage. However, keep in mind that hotels offering 
        extensive amenities may come at a higher cost, so balance your needs with 
        your budget.
      </p>
    </div>

    <div class="flex justify-center">
      <img 
        src="/Blogs/Evaluate.jpeg"
        class="rounded-lg shadow-md object-cover"
        style="width:320px; height:auto;"
      />
    </div>

  </div>

  <!-- Conclusion -->
  <h2 class="text-2xl font-bold text-[#066f73] mb-3">Conclusion</h2>
  <p class="text-gray-700 leading-7">
    Finding the best hotels in Makkah requires a thoughtful balance between comfort, convenience, and cost. With millions of visitors arriving for Hajj and Umrah each year, early planning and smart decision-making are essential. By carefully comparing hotel locations, checking reviews, and evaluating amenities, travelers can ensure a pleasant and spiritually fulfilling stay. Prioritizing proximity to Al-Masjid al-Haram may offer unmatched convenience, while exploring slightly distant hotels can provide better value and quieter surroundings. Ultimately, the best hotel choice depends on your individual preferences, budget, and travel needs. A well-planned stay not only enhances your comfort but also allows you to focus wholeheartedly on your spiritual journey in the holy city of Makkah.
  </p>

</div>
      `,
    },

    {
      slug: "best-hotels-in-makkah-2",
      title: "Best Hotels in Makkah",
      date: "14 Oct 2025",
      time: "11:00 am",
      image: "/hotel/hotel2.jpeg",
      content: `
        <h2 class="text-2xl font-bold mb-4 text-[#066f73]">Best Hotels in Makkah</h2>
        <p class="text-gray-700 leading-7">
          Best Hotel in Makkah
        </p>
      `,
    },
  ];

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-600">
        Blog Not Found
      </div>
    );
  }

  const [comments, setComments] = useState<
    { name: string; email: string; message: string; date: string }[]
  >([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentScroll = window.scrollY;

    setComments((prev) => [
      { name, email, message, date: new Date().toLocaleDateString() },
      ...prev,
    ]);

    setName("");
    setEmail("");
    setMessage("");
    setShowComments(true);
    window.scrollTo({ top: currentScroll });
  };


  return (
    <>
      <Header />

      {/* BANNER */}
      <div className="w-full relative">
        <div className="w-full h-56 md:h-80 lg:h-96 relative overflow-hidden">
          <img src={blog.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold text-white">{blog.title}</h1>
          </div>
        </div>
      </div>

      {/* META */}
      {/* META */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-10 text-center">
          <span>
            <strong>Date:</strong> {blog.date}
          </span>

          <span>
            <strong>Time:</strong> {blog.time}
          </span>

          <span>
            <strong>Comments:</strong> {comments.length}
          </span>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div
        className="max-w-[1200px] mx-auto px-4 py-6 leading-7"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div
        className={`max-w-[1200px] mx-auto px-4 overflow-hidden transition-all duration-500 ${showComments ? "max-h-[800px] mb-6" : "max-h-0"
          }`}
      >
        <div className="border p-4 bg-gray-50 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {comments.map((c, i) => (
            <div key={i} className="bg-white p-4 rounded-md shadow mb-3">
              <p className="font-semibold">
                {c.name} • {c.date}
              </p>
              <p>{c.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT FORM */}
      <div className="max-w-[1200px] mx-auto px-4 my-10">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 border rounded bg-gray-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 border rounded bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              placeholder="Write your comment..."
              rows={5}
              className="w-full p-2 border rounded bg-gray-100"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-6 py-2 rounded-md">
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
