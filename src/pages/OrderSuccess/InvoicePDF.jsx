import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import cairoFont from "../../../src/fonts/Cairo-VariableFont_slnt,wght.ttf";

// Register Cairo Font
Font.register({
  family: 'Cairo',
  src: cairoFont,
});

// Success Check Icon Component
const CheckIcon = () => (
  <Svg style={styles.successIconContainer} viewBox="0 0 24 24">
    <Path
      d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L8.59 18.59c.39.39 1.02.39 1.41 0L19.41 9.17c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"
      fill="#fff"
    />
  </Svg>
);
const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return '0.00';
  }
  
  // Convert to number, handling string inputs
  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
  
  // Check if it's a valid number
  if (isNaN(numPrice)) {
    return '0.00';
  }
  
  return numPrice.toFixed(2);
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 12,
    padding: 20,
    lineHeight: 1.4,
    backgroundColor: '#f8f9fa',
    direction: 'rtl',
    textAlign:"right"
  },
  
  // Header with success message
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  successRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap:25
  },
  
  successIconContainer: {
    width: 35,
    height: 35,
    marginLeft: 8,
    marginTop: 2,
    backgroundColor:"#3a6",
    borderRadius:20,
    textAlign:"center",
    fontSize:30
    
  },
  
  headerSuccess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  
  orderInfo: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  
  // Section containers
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  
  // Client and Address Info
  infoRow: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 6,
    paddingRight: 8,
  },
  
  // Order details with better spacing
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottom: '1px solid #f3f4f6',
  },
  
  detailsRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    marginTop: 8,
  },
  
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  detailValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  
  detailValueTotal: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'bold',
  },
  
  // Products styling
  productItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    border: '1px solid #e5e7eb',
  },
  
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  
  productQuantity: {
    fontSize: 11,
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  productLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  
  productValue: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  
  productTotal: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 4,
  },
});

// PDF Component
const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header with success message */}
      <View style={styles.headerContainer}>
        <View style={styles.successRow}>
          <CheckIcon />
          <Text style={styles.headerSuccess}>تم تأكيد طلبك بنجاح!</Text>
        </View>
        <Text style={styles.orderInfo}>
          رقم الطلب: {order.order_number}
        </Text>
        <Text style={styles.orderInfo}>
          تاريخ الطلب: {new Date(order.created_at).toLocaleString('ar-EG')}
        </Text>
      </View>

      {/* Client Info */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>معلومات العميل</Text>
        <Text style={styles.infoRow}>الاسم: {order.client.name}</Text>
        <Text style={styles.infoRow}>البريد الإلكتروني: {order.client.email}</Text>
        <Text style={styles.infoRow}>رقم الهاتف: {order.client.phone}</Text>
      </View>

      {/* Address Info */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
        <Text style={styles.infoRow}>{order.address.address_line1}</Text>
        {order.address.address_line2 && (
          <Text style={styles.infoRow}>{order.address.address_line2}</Text>
        )}
        <Text style={styles.infoRow}>{order.address.city}, {order.address.state}</Text>
        <Text style={styles.infoRow}>الرمز البريدي: {order.address.postal_code}</Text>
      </View>
      {/* Products List */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>المنتجات المطلوبة</Text>

        {/* Individual Products */}
        {order.products?.map((product, idx) => (
          <View key={`product-${idx}`} style={styles.productItem}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.product_name || 'منتج غير محدد'}</Text>
              <Text style={styles.productQuantity}>الكمية: {product.quantity || 1}</Text>
            </View>
            
            <View style={styles.productDetails}>
              <Text style={styles.productLabel}>سعر القطعة</Text>
              <Text style={styles.productValue}>{formatPrice(product.unit_price)} ر.س</Text>
            </View>
            
            <Text style={styles.productTotal}>
              المجموع: {formatPrice(product.total_price)} ر.س
            </Text>
          </View>
        ))}

        {/* Packages */}
        {order.packages?.map((pkg, idx) => (
          <View key={`pkg-${idx}`} style={styles.productItem}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{pkg.package_name || 'باقة غير محددة'}</Text>
              <Text style={styles.productQuantity}>الكمية: {pkg.quantity || 1}</Text>
            </View>
            
            <View style={styles.productDetails}>
              <Text style={styles.productLabel}>سعر الباقة</Text>
              <Text style={styles.productValue}>{formatPrice(pkg.unit_price)} ر.س</Text>
            </View>
            
            <Text style={styles.productTotal}>
              المجموع: {formatPrice(pkg.total_price)} ر.س
            </Text>
          </View>
        ))}
      </View>
{/* Order Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>تفاصيل الطلب</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>قيمة المنتجات</Text>
          <Text style={styles.detailValue}>{formatPrice(order.total_amount)} ر.س</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>قيمة الشحن</Text>
          <Text style={styles.detailValue}>{formatPrice(order.shipping_cost)} ر.س</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>طريقة الدفع</Text>
          <Text style={styles.detailValue}>
            {order.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'تابي'}
          </Text>
        </View>
        
        <View style={styles.detailsRowLast}>
          <Text style={styles.detailLabel}>إجمالي الطلب</Text>
          <Text style={styles.detailValueTotal}>{formatPrice(order.final_amount)} ر.س</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;