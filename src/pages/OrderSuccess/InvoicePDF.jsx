import React from 'react';
import {
  Page, Text, View, Document, StyleSheet, Font, Svg, Path, Image
} from '@react-pdf/renderer';
import cairoFont from "../../../src/fonts/Cairo-VariableFont_slnt,wght.ttf";

Font.register({
  family: 'Cairo',
  src: cairoFont,
});

const formatPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#fff',
    direction: 'rtl',
    textAlign: 'right',
  },
  headerContainer: {
    backgroundColor: '#667eea',
    padding: 25,
    marginBottom: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    border: '3px solid #fff',
  },
  companyTitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyInfo: {
    fontSize: 11,
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 20,
  },
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderBottom: '2px solid #667eea',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  sectionContent: {
    padding: 15,
    backgroundColor: '#fefefe',
  },
  infoRow: {
    fontSize: 12,
    marginBottom: 6,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#667eea',
    minWidth: 80,
    marginLeft: 10,
  },
  tableContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    padding: 12,
    borderBottom: '2px solid #4f46e5',
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#fefefe',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  col1: { flex: 3, fontSize: 11, color: '#374151' },
  col2: { flex: 1, fontSize: 11, textAlign: 'center', color: '#374151' },
  col3: { flex: 1, fontSize: 11, textAlign: 'center', color: '#374151' },
  col4: { flex: 1, fontSize: 11, textAlign: 'center', color: '#667eea', fontWeight: 'bold' },
  summaryContainer: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 12,
    border: '2px solid #bbf7d0',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1px solid #d1fae5',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 12,
    color: '#047857',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#059669',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  footerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 1.4,
  },
});

const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Image src="data:image/png;base64,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" style={styles.logo} />
      </View>
      <View style={styles.companyInfo}>
        <Text>شركة لبان الغزال العلاجية</Text>
        <Text>البريد الإلكتروني: support@lubanelgazal.com</Text>
        <Text>العنوان: شارع الصحة - الرياض - السعودية</Text>
      </View>
      <Text style={styles.headerTitle}>فاتورة شراء</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>بيانات الطلب</Text>
        <Text style={styles.infoRow}>رقم الطلب: {order.order_number}</Text>
        <Text style={styles.infoRow}>تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        <Text style={styles.infoRow}>طريقة الدفع: {order.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'تابي'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات العميل</Text>
        <Text style={styles.infoRow}>الاسم: {order.client.name}</Text>
        <Text style={styles.infoRow}>رقم الهاتف: {order.client.phone}</Text>
        <Text style={styles.infoRow}>البريد الإلكتروني: {order.client.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
        <Text style={styles.infoRow}>{order.address.address_line1}</Text>
        {order.address.address_line2 && <Text style={styles.infoRow}>{order.address.address_line2}</Text>}
        <Text style={styles.infoRow}>{order.address.city}, {order.address.state}</Text>
        <Text style={styles.infoRow}>الرمز البريدي: {order.address.postal_code}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تفاصيل المنتجات</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>المنتج</Text>
          <Text style={styles.col2}>الكمية</Text>
          <Text style={styles.col3}>السعر</Text>
          <Text style={styles.col4}>الإجمالي</Text>
        </View>
        {[...(order.products || []), ...(order.packages || [])].map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.col1}>{item.product_name || item.package_name}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{formatPrice(item.unit_price)} ر.س</Text>
            <Text style={styles.col4}>{formatPrice(item.total_price)} ر.س</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text>إجمالي المنتجات:</Text>
          <Text>{formatPrice(order.total_amount)} ر.س</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>قيمة الشحن:</Text>
          <Text>{formatPrice(order.shipping_cost)} ر.س</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>الإجمالي الكلي:</Text>
          <Text>{formatPrice(order.final_amount)} ر.س</Text>
        </View>
      </View>

      <Text style={styles.footerNote}>شكراً لتسوقكم من لبان الغزال، نتمنى لكم يوماً سعيداً.</Text>
    </Page>
  </Document>
);

export default InvoicePDF;
