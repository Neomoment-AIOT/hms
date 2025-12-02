import Link from "next/link";

export default function BlogsPage() {
  const blogs = [
    {
      slug: "5-tips-to-find-the-best-hotels-in-makkah",
      title: "5 Tips to find the best hotels in Makkah",
      description:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/Blogs/Blog.jpeg",
    },
    {
      slug: "best-hotels-in-makkah-2",
      title: "Best Hotel in makkah",
      description:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/hotel/hotel2.jpeg",
    },
    {
      slug: "best-hotels-in-makkah-3",
      title: "5 Tips to find the best hotels in Makkah",
      description:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/hotel/hotel3.jpeg",
    },
  ];

  return (
    <section className="bg-[#f8fafb] py-10">
      <div className="max-w-[1200px] mx-auto px-4 space-y-10">
        {blogs.map((b) => (
          <article
            key={b.slug}
            className="bg-white rounded-md shadow-sm flex gap-6 items-start p-6"
          >
            {/* Image */}
            <img
              src={b.image}
              alt="blog"
              className="w-48 h-36 object-cover rounded-md"
            />

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-xl font-bold">{b.title}</h2>

              <p className="text-gray-600 mt-2">{b.description}</p>

              <div className="flex items-center gap-6 text-sm mt-3">
                <span>
                  <strong>Date:</strong>{" "}
                  <span className="text-emerald-700">{b.date}</span>
                </span>
                <span>
                  <strong>Time:</strong>{" "}
                  <span className="text-emerald-700">{b.time}</span>
                </span>
                <span>
                  <strong>Comments:</strong>{" "}
                  <span className="text-emerald-700">{b.comments}</span>
                </span>
              </div>

              <Link href={`/blog/${b.slug}`} className="inline-block">
                <button className="mt-4 bg-linear-to-r from-[#1F8593] to-[#052E39] px-6 py-2 text-white font-semibold rounded-md cursor-pointer">
                  Learn More...
                </button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
