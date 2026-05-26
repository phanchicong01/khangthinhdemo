// NOTE(plan-01-02): Header/Footer imports stripped — skeleton Header.tsx/Footer.tsx
// deleted in Phase 1 (FND-07). Phase 2 will introduce new Nav/Footer; this page
// is a placeholder list view until Phase 3 rewrites it.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu | Khang Thịnh Investment",
  description: "Các công trình tiêu biểu Khang Thịnh Investment đã thực hiện",
};

const projects = [
  {
    id: 1,
    name: "Cao tốc Cái Nước - Đất Mũi Cà Mau",
    client: "Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn",
    type: "Hạ tầng giao thông",
    role: "Cung ứng vật liệu xây dựng, san lấp mặt bằng",
    location: "Cà Mau",
    scale: "Dự án quốc gia",
  },
  {
    id: 2,
    name: "Cầu Cửa Lớn - Đất Mũi Cà Mau",
    client: "Dự án cầu trọng điểm",
    type: "Cầu đường",
    role: "Cung cấp vật liệu, vận chuyển đường thủy",
    location: "Cà Mau",
    scale: "Dự án tỉnh",
  },
  {
    id: 3,
    name: "Đường giao thông ra đảo Hòn Khoai",
    client: "Hạ tầng đảo Hòn Khoai",
    type: "Hạ tầng giao thông",
    role: "Vận chuyển vật liệu đường thủy, cung ứng cát đá",
    location: "Cà Mau",
    scale: "Dự án đặc biệt",
  },
  {
    id: 4,
    name: "Nhà phố Cô Thúy",
    client: "Tư nhân",
    type: "Xây dựng dân dụng",
    role: "Thi công phần thô và hoàn thiện",
    location: "Thạnh Hóa, Long An",
    scale: "Nhà ở",
  },
  {
    id: 5,
    name: "Nhà Anh Bình",
    client: "Tư nhân",
    type: "Xây dựng dân dụng",
    role: "Thi công xây dựng",
    location: "Mỹ Yên",
    scale: "Nhà ở",
  },
  {
    id: 6,
    name: "Nhà Chị Ngọc",
    client: "Tư nhân",
    type: "Xây dựng dân dụng",
    role: "Thi công xây dựng",
    location: "Long An",
    scale: "Nhà ở",
  },
];

const typeColors: Record<string, string> = {
  "Hạ tầng giao thông": "bg-blue-100 text-blue-700",
  "Cầu đường": "bg-purple-100 text-purple-700",
  "Xây dựng dân dụng": "bg-green-100 text-green-700",
};

export default function DuAnPage() {
  return (
    <>
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-[#1a5276] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Dự án tiêu biểu</h1>
            <p className="text-blue-200 text-base">
              Những công trình chúng tôi tự hào đã đóng góp và thực hiện
            </p>
          </div>
        </section>

        {/* Projects grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:border-[#2e86c1] transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a5276] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {p.id}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[p.type] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1c2833] text-base mb-2">{p.name}</h3>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div>📍 {p.location}</div>
                    <div>👷 {p.role}</div>
                    <div>🏢 {p.client}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-[#f39c12] font-medium">{p.scale}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
