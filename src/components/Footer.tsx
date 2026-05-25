export default function Footer() {
  return (
    <footer className="bg-[#1c2833] text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company */}
        <div>
          <div className="text-white font-bold text-lg mb-3">KHANG THỊNH INV</div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Công ty TNHH Khang Thịnh Investment<br />
            MST: 1102 107 064<br />
            Thành lập: 2025
          </p>
          <p className="mt-3 text-sm italic text-[#f39c12]">"Hợp tác cùng phát triển"</p>
        </div>

        {/* Contact */}
        <div>
          <div className="text-white font-semibold mb-3">Liên hệ</div>
          <ul className="space-y-2 text-sm">
            <li>📍 A3-02 KDC Long Phú, Bến Lức, Tây Ninh</li>
            <li>📞 <a href="tel:0921985599" className="hover:text-[#f39c12]">092 198 55 99</a></li>
            <li>✉️ <a href="mailto:khangthinhinv2025@gmail.com" className="hover:text-[#f39c12]">khangthinhinv2025@gmail.com</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="text-white font-semibold mb-3">Dịch vụ</div>
          <ul className="space-y-1 text-sm">
            <li>→ Cung ứng Cát - Đá - San lấp</li>
            <li>→ Xây dựng dân dụng</li>
            <li>→ Vận chuyển đường thủy</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © 2025 Khang Thịnh Investment. All rights reserved.
      </div>
    </footer>
  );
}
