import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const services = [
  {
    icon: "🪨",
    title: "Cung ứng Cát - Đá - San lấp",
    desc: "Cung cấp vật liệu xây dựng chất lượng cao: cát xây dựng, đá các loại, đất san lấp mặt bằng phục vụ công trình lớn nhỏ.",
  },
  {
    icon: "🏗️",
    title: "Xây dựng dân dụng",
    desc: "Thi công nhà phố, công trình dân dụng, hạ tầng kỹ thuật. Đảm bảo tiến độ, chất lượng và an toàn công trình.",
  },
  {
    icon: "🚢",
    title: "Vận chuyển đường thủy",
    desc: "Dịch vụ vận chuyển hàng hóa, vật liệu bằng đường thủy. Kết nối các tuyến sông khu vực miền Nam.",
  },
];

const projects = [
  {
    name: "Cao tốc Cái Nước - Đất Mũi Cà Mau",
    owner: "Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn",
    type: "Hạ tầng giao thông",
  },
  {
    name: "Cầu Cửa Lớn - Đất Mũi Cà Mau",
    owner: "Dự án cầu trọng điểm",
    type: "Cầu đường",
  },
  {
    name: "Đường giao thông ra đảo Hòn Khoai",
    owner: "Hạ tầng đảo",
    type: "Hạ tầng giao thông",
  },
  {
    name: "Nhà phố Cô Thúy - Thạnh Hóa",
    owner: "Công trình dân dụng",
    type: "Xây dựng",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-br from-[#1a5276] to-[#154360] flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 py-20 text-white">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#f39c12] text-[#1c2833] text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              Thành lập 2025 · Tây Ninh
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Khang Thịnh Investment
            </h1>
            <p className="text-xl text-blue-200 mb-4 italic">
              "Hợp tác cùng phát triển"
            </p>
            <p className="text-base text-blue-100 leading-relaxed mb-8">
              Chuyên cung ứng vật liệu xây dựng, thi công công trình dân dụng
              và vận chuyển đường thủy. Đối tác tin cậy của nhiều dự án quốc gia
              tại miền Nam Việt Nam.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:0921985599"
                className="bg-[#f39c12] hover:bg-[#e67e22] text-[#1c2833] font-bold px-6 py-3 rounded-lg transition-colors"
              >
                📞 Liên hệ ngay
              </a>
              <Link
                href="/du-an"
                className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg transition-colors"
              >
                Xem dự án tiêu biểu →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50" id="dich-vu">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5276] mb-3">Dịch vụ của chúng tôi</h2>
            <p className="text-gray-500">Giải pháp toàn diện cho công trình xây dựng và hạ tầng</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1a5276] mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-white" id="du-an">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5276] mb-3">Dự án tiêu biểu</h2>
            <p className="text-gray-500">Những công trình chúng tôi đã và đang tham gia thực hiện</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#2e86c1] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1a5276] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-[#1c2833] mb-1">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.owner}</div>
                  <span className="mt-2 inline-block text-xs bg-blue-100 text-[#1a5276] px-2 py-0.5 rounded-full">
                    {p.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/du-an"
              className="inline-block bg-[#1a5276] hover:bg-[#154360] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Xem tất cả dự án →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#f39c12]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c2833] mb-4">
            Bạn có nhu cầu hợp tác?
          </h2>
          <p className="text-[#5d4037] mb-8 text-base">
            Liên hệ ngay để được tư vấn và báo giá nhanh chóng
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:0921985599"
              className="bg-[#1a5276] hover:bg-[#154360] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              📞 092 198 55 99
            </a>
            <a
              href="mailto:khangthinhinv2025@gmail.com"
              className="bg-white hover:bg-gray-100 text-[#1a5276] font-bold px-8 py-3 rounded-lg transition-colors"
            >
              ✉️ Gửi email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
