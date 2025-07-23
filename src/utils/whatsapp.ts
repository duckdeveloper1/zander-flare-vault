export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: Date;
}

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ZS-${timestamp}-${random}`.toUpperCase();
};

export const formatWhatsAppMessage = (order: Order): string => {
  const items = order.items.map(item => 
    `• ${item.name} (${item.quantity}x)${item.size ? ` - Tamanho: ${item.size}` : ''}${item.color ? ` - Cor: ${item.color}` : ''}\n  R$ ${item.price.toFixed(2)}`
  ).join('\n\n');

  const message = `🛍️ *NOVA ORDEM - ZANDER STORE*

📋 *Código do Pedido:* ${order.id}
👤 *Cliente:* ${order.customerName}
📱 *Telefone:* ${order.customerPhone}
${order.customerEmail ? `📧 *Email:* ${order.customerEmail}` : ''}

🛒 *Itens do Pedido:*
${items}

💰 *Total:* R$ ${order.total.toFixed(2)}

📅 *Data:* ${order.createdAt.toLocaleDateString('pt-BR')} às ${order.createdAt.toLocaleTimeString('pt-BR')}

---
Pedido gerado automaticamente pelo site da Zander Store`;

  return encodeURIComponent(message);
};

export const generateWhatsAppMessage = (orderData: { items: any[], total: number, type?: string }) => {
  const orderId = generateOrderId();
  const items = orderData.items.map(item => 
    `• ${item.name} (${item.quantity}x)\n  R$ ${item.price.toFixed(2)}`
  ).join('\n\n');

  const message = `🛍️ *NOVO PEDIDO - ZANDER STORE*

📋 *Código do Pedido:* ${orderId}

🛒 *Itens do Pedido:*
${items}

💰 *Total:* R$ ${orderData.total.toFixed(2)}

📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

---
Pedido gerado automaticamente pelo site da Zander Store`;

  return `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
};

export const sendToWhatsApp = (order: Order, phoneNumber: string = '5511999999999') => {
  const message = formatWhatsAppMessage(order);
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
};