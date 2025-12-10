"use client";

import Header from "@/app/_components/header/page";
import Footer from "@/app/_components/footer/page";
import { useState, FormEvent, useContext } from "react";
import { useParams } from "next/navigation";
import { LangContext } from "@/app/lang-provider";

export default function BlogPostPage() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  // FIXED ✔ Get slug properly in client component
  const { slug } = useParams() as { slug: string };


  // ⭐ BLOG DATA (EN + AR)
  const blogs = [
    {
      slug: "5-tips-to-find-the-best-hotels-in-makkah",

      titleEn: "5 Tips to find the best hotels in Makkah",
      titleAr: "٥ نصائح للعثور على أفضل الفنادق في مكة",

      dateEn: "12 Oct 2025",
      dateAr: "12 أكتوبر 2025",

      timeEn: "12:00 pm",
      timeAr: "12:00 مساءً",

      image: "/Blogs/Blog.jpeg",

      contentEn: `
      <div class="space-y-12">

      <p class="text-gray-700 leading-7 text-center max-w-4xl mx-auto">
      Finding the best hotels in Makkah requires careful and strategic planning to balance comfort, convenience, and affordability. With the city attracting millions of pilgrims each year, choosing the right accommodation near the Holy Mosque can significantly enhance your overall experience. Factors such as proximity to Al-Masjid al-Haram, amenities, transportation options, and budget play a crucial role in making an informed decision. By comparing hotel ratings, reviews, and seasonal offers, travelers can find the perfect stay that meets their spiritual and practical needs during their visit to Makkah.
      </p>

      <!-- SECTION 1 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">
        <div class="flex justify-center">
          <img src="/Blogs/Consider.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

        <div>
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">Consider the Distance</h2>
          <p class="text-gray-700 leading-7">
          Finding the best hotels in Makkah requires careful and strategic planning to balance comfort, convenience, and affordability. With the city attracting millions of pilgrims each year, choosing the right accommodation near the Holy Mosque can significantly enhance your overall experience. Factors such as proximity to Al-Masjid al-Haram, amenities, transportation options, and budget play a crucial role in making an informed decision.
          </p>
        </div>
      </div>

      <!-- SECTION 2 -->
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">
        <div>
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">Compare Hotel Amenities and Services</h2>
          <p class="text-gray-700 leading-7">
          Choosing a hotel close to Al-Masjid al-Haram can save time and energy, especially during peak seasons or prayer times. Staying nearby offers convenience and easy access to the Haram, which is ideal for elderly pilgrims or families. However, hotels near the mosque tend to be more expensive and can get crowded.
          </p>
        </div>

        <div class="flex justify-center">
          <img src="/Blogs/Compare.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>
      </div>

      <!-- SECTION 3 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">

        <div class="flex justify-center">
          <img src="/Blogs/Check.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

        <div>
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">Check Reviews and Ratings</h2>
          <p class="text-gray-700 leading-7">
          Reading guest reviews and checking hotel ratings on trusted platforms can give you real insights into cleanliness, service quality, and amenities. The benefit of this approach is that it helps you avoid unpleasant surprises and ensures you get what you pay for. On the downside, some reviews can be biased or outdated, so it’s wise to read a mix of recent and detailed reviews for a balanced perspective.
          </p>
        </div>

      </div>

       <!-- SECTION 4 -->
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">
        <div>
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">Evaluate Amennties and Services</h2>
          <p class="text-gray-700 leading-7">
          Before booking, check what facilities the hotel provides, such as free Wi-Fi, shuttle services to the Haram, on-site dining, or prayer areas. These amenities can greatly enhance comfort and convenience during your stay. The advantage of prioritizing such services is that they save time and effort, allowing you to focus more on your pilgrimage. However, keep in mind that hotels offering extensive amenities may come at a higher cost, so balance your needs with your budget.
          </p>
        </div>

        <div class="flex justify-center">
          <img src="/Blogs/Evaluate.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>
      </div>

      <!-- Conclusion -->
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">Conclusion</h2>
      <p class="text-gray-700 leading-7">
      Finding the best hotels in Makkah requires a thoughtful balance between comfort, convenience, and cost. With millions of visitors arriving for Hajj and Umrah each year, early planning and smart decision-making are essential. By carefully comparing hotel locations, checking reviews, and evaluating amenities, travelers can ensure a pleasant and spiritually fulfilling stay. Prioritizing proximity to Al-Masjid al-Haram may offer unmatched convenience, while exploring slightly distant hotels can provide better value and quieter surroundings. Ultimately, the best hotel choice depends on your individual preferences, budget, and travel needs. A well-planned stay not only enhances your comfort but also allows you to focus wholeheartedly on your spiritual journey in the holy city of Makkah.
      </p>

      </div>
    `,

      // ⭐ ARABIC CONTENT (RTL + font-arabic)
      contentAr: `
      <div class="space-y-12 font-arabic" dir="rtl">

      <p class="text-gray-700 leading-7 text-center max-w-4xl mx-auto font-arabic">
      يتطلب العثور على أفضل الفنادق في مكة تخطيطًا دقيقًا واستراتيجيًا لتحقيق التوازن بين الراحة والملاءمة والقدرة على تحمل التكاليف. مع جذب المدينة لملايين الحجاج كل عام، فإن اختيار مكان الإقامة المناسب بالقرب من المسجد الحرام يمكن أن يعزز تجربتك الشاملة بشكل كبير. تلعب عوامل مثل القرب من المسجد الحرام والمرافق وخيارات النقل والميزانية دورًا حاسمًا في اتخاذ قرار مستنير. ومن خلال مقارنة تقييمات الفنادق والمراجعات والعروض الموسمية، يمكن للمسافرين العثور على الإقامة المثالية التي تلبي احتياجاتهم الروحية والعملية أثناء زيارتهم لمكة المكرمة.
      </p>

      <!-- SECTION 1 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">

        <div class="flex justify-center">
          <img src="/Blogs/Consider.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

        <div class="font-arabic">
          <h2 class="text-2xl font-bold text-[#066f73] mb-3 font-arabic">ضع المسافة في الاعتبار</h2>
          <p class="text-gray-700 leading-7 font-arabic">
        يتطلب العثور على أفضل الفنادق في مكة تخطيطًا دقيقًا واستراتيجيًا لتحقيق التوازن بين الراحة والملاءمة والقدرة على تحمل التكاليف. مع جذب المدينة لملايين الحجاج كل عام، فإن اختيار مكان الإقامة المناسب بالقرب من المسجد الحرام يمكن أن يعزز تجربتك الشاملة بشكل كبير. تلعب عوامل مثل القرب من المسجد الحرام والمرافق وخيارات النقل والميزانية دورًا حاسمًا في اتخاذ قرار مستنير.
          </p>
        </div>

      </div>

      <!-- SECTION 2 -->
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">

        <div class="font-arabic">
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">مقارنة مرافق وخدمات الفندق</h2>
          <p class="text-gray-700 leading-7">
          اختيار فندق قريب من المسجد الحرام يمكن أن يوفر الوقت والطاقة، خاصة خلال مواسم الذروة أو أوقات الصلاة. الإقامة في مكان قريب توفر الراحة وسهولة الوصول إلى الحرم، وهو مكان مثالي للحجاج المسنين أو العائلات. ومع ذلك، فإن الفنادق القريبة من المسجد تميل إلى أن تكون أكثر تكلفة ويمكن أن تكون مزدحمة .
          </p>
        </div>

        <div class="flex justify-center">
          <img src="/Blogs/Compare.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

      </div>

      <!-- SECTION 3 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-center">

        <div class="flex justify-center">
          <img src="/Blogs/Check.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

        <div class="font-arabic">
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">تحقق من التقييمات والمراجعات</h2>
          <p class="text-gray-700 leading-7">
          يمكن أن تمنحك قراءة تقييمات الضيوف والتحقق من تقييمات الفنادق على منصات موثوقة رؤى حقيقية حول النظافة وجودة الخدمة ووسائل الراحة. وتتمثل فائدة هذا النهج في أنه يساعدك على تجنب المفاجآت غير السارة ويضمن حصولك على ما تدفع مقابله. على الجانب السلبي، قد تكون بعض المراجعات متحيزة أو قديمة، لذلك من الحكمة قراءة مزيج من المراجعات الحديثة والمفصلة للحصول على منظور متوازن.
          </p>
        </div>

      </div>

      <!-- SECTION 4 -->
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-center">

        <div class="font-arabic">
          <h2 class="text-2xl font-bold text-[#066f73] mb-3">تقييم المرافق والخدمات</h2>
          <p class="text-gray-700 leading-7">
           قبل الحجز، تحقق من المرافق التي يوفرها الفندق، مثل خدمة الواي فاي المجانية، أو خدمات النقل إلى الحرم، أو تناول الطعام في الموقع، أو مناطق الصلاة. يمكن لهذه المرافق أن تعزز بشكل كبير الراحة والملاءمة أثناء إقامتك. وميزة إعطاء الأولوية لهذه الخدمات هي أنها توفر الوقت والجهد، مما يسمح لك بالتركيز أكثر على الحج الخاص بك. ومع ذلك، ضع في اعتبارك أن الفنادق التي تقدم وسائل راحة شاملة قد تأتي بتكلفة أعلى، لذا قم بموازنة احتياجاتك مع ميزانيتك.
          </p>
        </div>

        <div class="flex justify-center">
          <img src="/Blogs/Evaluate.jpeg" class="rounded-lg shadow-md object-cover" style="width:320px" />
        </div>

      </div>

      <!-- Conclusion -->
      <h2 class="text-2xl font-bold text-[#066f73] mb-3">خاتمة:</h2>
      <p class="text-gray-700 leading-7">
      يتطلب العثور على أفضل الفنادق في مكة إيجاد توازن مدروس بين الراحة والملاءمة والتكلفة. مع وصول ملايين الزوار لأداء مناسك الحج والعمرة كل عام، يعد التخطيط المبكر واتخاذ القرارات الذكية أمرًا ضروريًا. من خلال مقارنة مواقع الفنادق بعناية، والتحقق من التقييمات، وتقييم وسائل الراحة، يمكن للمسافرين ضمان إقامة ممتعة ومرضية روحيًا. إن إعطاء الأولوية للقرب من المسجد الحرام قد يوفر راحة لا مثيل لها، في حين أن استكشاف الفنادق البعيدة قليلاً يمكن أن يوفر قيمة أفضل ومحيطًا أكثر هدوءًا. في النهاية، يعتمد اختيار الفندق الأفضل على تفضيلاتك الفردية وميزانيتك واحتياجات السفر. إن الإقامة المخططة جيدًا لا تعزز راحتك فحسب، بل تسمح لك أيضًا بالتركيز بكل إخلاص على رحلتك الروحية في مدينة مكة المكرمة .
      </p>

      </div>
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

  const submitComment = (e: FormEvent) => {
    e.preventDefault();

    setComments((prev) => [
      { name, email, message, date: new Date().toLocaleDateString() },
      ...prev,
    ]);

    setName("");
    setEmail("");
    setMessage("");
    setShowComments(true);
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
            <h1 className={`text-4xl font-bold text-white ${ar ? "font-arabic" : ""}`}>
              {ar ? blog.titleAr : blog.titleEn}
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
            <strong>{ar ? "التاريخ:" : "Date:"}</strong>{" "}
            {ar ? blog.dateAr : blog.dateEn}
          </span>

          <span>
            <strong>{ar ? "الوقت:" : "Time:"}</strong>{" "}
            {ar ? blog.timeAr : blog.timeEn}
          </span>

          <span>
            <strong>{ar ? "التعليقات:" : "Comments:"}</strong>{" "}
            {comments.length}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`max-w-[1200px] mx-auto px-4 py-6 leading-7 ${
          ar ? "font-arabic" : ""
        }`}
        dir={ar ? "rtl" : "ltr"}
        dangerouslySetInnerHTML={{
          __html: ar ? blog.contentAr : blog.contentEn,
        }}
      />

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

            <button
              className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-6 py-2 rounded-md"
            >
              {ar ? "إرسال" : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* DISPLAY COMMENTS */}
      {showComments && (
        <div className="max-w-[1200px] mx-auto px-4 mb-10">
          <h2 className={`text-xl font-semibold mb-4 ${ar ? "font-arabic" : ""}`}>
            {ar ? `التعليقات (${comments.length})` : `Comments (${comments.length})`}
          </h2>

          {comments.map((c, i) => (
            <div key={i} className="bg-white p-4 rounded-md shadow mb-3">
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
