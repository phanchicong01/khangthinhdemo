import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dịch vụ | Khang Thịnh Investment",
  description: "Cung ứng cát đá san lấp, xây dựng dân dụng, vận chuyển đường thủy",
};

const services = [
  {
    icon: "🪨",
    title: "Cung ứng Cát - Đá - San lấp",
    desc: "Cung cấp đa dạng vật liệu xây dựng: cát xây, cát đúc, đá 1x2, đá 4x6, đá mi, đất san lấp mặt bằng. Nguồn hàng ổn định, giao nhanh theo công trình.",
    details: ["Cát xây, cát đúc các loại", "Đá dăm 1x2, 4x6, đá mi bụi", "Đất san lấp mặt bằng", "Giao hàng tận công trình"],
  },
  {
    icon: "🏗️",
    title: "Xây dựng dân dụng",
    desc: "Nhận thi công nhà phố, biệt thự, công trình dân dụng từ phần móng đến hoàn thiện. Đội ngũ kỹ thuật kinh nghiệm, đảm bảo tiến độ.",
    details: ["Thi công nhà phố, biệt thự", "Công trình hạ tầng kỹ thuật", "Phần thô đến hoàn thiện", "Giám sát chất lượng chặt chẽ"],
  },
  {
    icon: "🚢",
    title: "Vận chuyển đường thủy",
    desc: "Vận chuyển hàng hóa, vật liệu xây dựng bằng sà lan đường sông. Phủ sóng các tuyến sông khu vực miền Nam, giá cạnh tranh.",
    details: ["Vận chuyển sà lan đường sông", "Các tuyến miền Nam Việt Nam", "Hàng hóa, vật liệu xây dựng", "Chi phí tối ưu, đúng hẹn"],
  },
];

export default function DichVuPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-[#1a5276] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Dịch vụ của chúng tôi</h1>
            <p className="text-blue-200 text-base">
              Giải pháp toàn diện — từ cung ứng vật liệu đến thi công và vận chuyển
            </p>
          </div>
        </section>

        {/* Services detail */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 space-y-10">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <div className="text-5xl mb-4">{s.icon}</div>
                  <h2 className="text-2xl font-bold text-[#1a5276] mb-3">{s.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <div className="text-sm font-semibold text-[#1a5276] mb-3">Chi tiết dịch vụ:</div>
                  <ul className="space-y-2">
                    {s.details.map((d, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-[#f39c12]">✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-[#1a5276] text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="text-xl font-bold mb-4">Cần báo giá dịch vụ?</h3>
            <a
              href="tel:0921985599"
              className="inline-block bg-[#f39c12] hover:bg-[#e67e22] text-[#1c2833] font-bold px-8 py-3 rounded-lg transition-colors"
            >
              📞 Gọi ngay: 092 198 55 99
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
