import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | Khang Thịnh Investment",
  description: "Liên hệ với Khang Thịnh Investment để được tư vấn và báo giá",
};

export default function LienHePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-[#1a5276] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-blue-200 text-base">
              Chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 7 ngày trong tuần
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            {/* Contact info */}
            <div>
              <h2 className="text-xl font-bold text-[#1a5276] mb-6">Thông tin liên hệ</h2>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">📍</div>
                  <div>
                    <div className="font-semibold text-[#1c2833]">Địa chỉ</div>
                    <div className="text-gray-600 text-sm mt-1">A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh, Việt Nam</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">📞</div>
                  <div>
                    <div className="font-semibold text-[#1c2833]">Điện thoại</div>
                    <a href="tel:0921985599" className="text-[#2e86c1] hover:text-[#1a5276] font-medium mt-1 block">
                      092 198 55 99
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <div className="font-semibold text-[#1c2833]">Email</div>
                    <a href="mailto:khangthinhinv2025@gmail.com" className="text-[#2e86c1] hover:text-[#1a5276] text-sm mt-1 block break-all">
                      khangthinhinv2025@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">🏢</div>
                  <div>
                    <div className="font-semibold text-[#1c2833]">Thông tin pháp lý</div>
                    <div className="text-gray-600 text-sm mt-1">
                      Công ty TNHH Khang Thịnh Investment<br />
                      MST: 1102 107 064<br />
                      ĐDPL: Tô Thị Bích Ngọc
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-[#f39c12]/10 border border-[#f39c12]/30 rounded-xl">
                <p className="text-sm text-[#7d6608] font-medium">
                  💡 Để được báo giá nhanh nhất, vui lòng gọi trực tiếp hoặc nhắn tin qua số điện thoại trên.
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1a5276] mb-6">Liên hệ nhanh</h2>
              <a
                href="tel:0921985599"
                className="flex items-center gap-4 bg-[#1a5276] hover:bg-[#154360] text-white rounded-xl p-5 transition-colors"
              >
                <div className="text-3xl">📞</div>
                <div>
                  <div className="font-bold">Gọi điện thoại</div>
                  <div className="text-blue-200 text-sm">092 198 55 99</div>
                </div>
              </a>
              <a
                href="mailto:khangthinhinv2025@gmail.com"
                className="flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#2e86c1] rounded-xl p-5 transition-all"
              >
                <div className="text-3xl">✉️</div>
                <div>
                  <div className="font-bold text-[#1c2833]">Gửi email</div>
                  <div className="text-gray-500 text-sm">khangthinhinv2025@gmail.com</div>
                </div>
              </a>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="font-bold text-[#1c2833] mb-2">🕐 Giờ làm việc</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Thứ 2 - Thứ 7: 7:00 - 17:30</div>
                  <div>Chủ nhật: Nghỉ (liên hệ khẩn nếu cần)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
