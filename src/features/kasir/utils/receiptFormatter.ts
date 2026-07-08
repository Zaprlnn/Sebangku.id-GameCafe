export function generateReceiptText(transaction: any, details: any[]) {
  const line = "================================";
  let itemText = "";
  
  details.forEach(item => {
    itemText += `${item.menus.name}\n  ${item.qty} x Rp ${item.price.toLocaleString()} = Rp ${(item.qty * item.price).toLocaleString()}\n`;
  });

  return `
      SEBANGKU GAME CAFE
   ========================
   Date: ${new Date(transaction.created_at).toLocaleString()}
   Payment: ${transaction.payment_method}
   ${line}
   ${itemText}
   ${line}
   TOTAL: Rp ${transaction.total.toLocaleString()}
   ========================
     Terima Kasih Atas
      Kunjungan Anda!
  `;
}