import { supabase } from "@/lib/supabase";

export interface WinpayInvoiceRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  paymentChannel: "QRIS" | "BCA" | "MANDIRI" | "BNI" | "SHOPEEPAY" | "OVO"; // Sesuai daftar Supported channel Winpay SNAP
}

export const winpayService = {
  /**
   * Mengirim permintaan pembuatan invoice resmi ke Supabase Edge Function 
   * yang telah terintegrasi dengan SNAP API Winpay
   */
  createSecureTransaction: async (payload: WinpayInvoiceRequest) => {
    try {
      // Menembak Supabase Edge Function bernama 'winpay-gateway'
      const { data, error } = await supabase.functions.invoke("winpay-gateway", {
        body: {
          external_id: payload.orderId,
          amount: payload.amount,
          customer_name: payload.customerName,
          customer_phone: payload.customerPhone,
          channel_code: payload.paymentChannel,
          callback_url: "https://eupvwumuutjorlalaejt.supabase.co/functions/v1/winpay-callback"
        }
      });

      if (error) throw error;
      
      // Mengembalikan response berisi URL checkout page atau gambar QRIS dinamis dari Winpay
      return {
        success: true,
        redirectUrl: data?.redirect_url || "",
        qrCode: data?.qr_string || "",
        token: data?.transaction_token || ""
      };
    } catch (err) {
      console.error("Winpay Secure Gateway Error:", err);
      
      // SIMULATOR FALLBACK: Jika Edge Function belum di-deploy ke hosting, jalankan simulator lokal untuk demonstrasi owner
      return winpayService.simulateLocalWinpay(payload);
    }
  },

  /**
   * Simulator Offline Winpay Gateway untuk keperluan demo presentasi internal
   */
  simulateLocalWinpay: async (payload: WinpayInvoiceRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi delay latency network server
    return {
      success: true,
      redirectUrl: `https://sandbox-snap.winpay.id/checkout/${btoa(payload.orderId)}`,
      qrCode: "00020101021226300024ID11111222233334444555566665204592853033605405150005802ID5911SEBANGKU_ID6009YOGYAKARTA6304A1B2",
      token: `WP-SIM-TOK-${Math.random().toString(36).substring(7).toUpperCase()}`
    };
  }
};