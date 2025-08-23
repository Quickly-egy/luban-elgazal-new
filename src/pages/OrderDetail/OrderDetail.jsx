import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaTimes,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaTimesCircle,
  FaExclamationCircle,
  FaCreditCard,
  FaStickyNote,
  FaDownload,
  FaShippingFast,
  FaEye
} from 'react-icons/fa';
import { useOrder } from '../../hooks/useClientOrders';
import { useCurrency } from '../../hooks';
import CancelOrderModal from '../../components/common/CancelOrderModal';
import ShippingTracker from '../../components/common/ShippingTracker';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPrice } from '../../utils/formatters';
import { getOrderShippingInfo } from '../../services/shipping';
import useAuthStore from '../../stores/authStore';
import styles from './OrderDetail.module.css';

// مكون الفاتورة المنفصل
const InvoiceTemplate = ({ order, formatPrice, formatDate, statusConfig }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '794px',
        minHeight: 'auto',
        backgroundColor: 'white',
        padding: '40px',
        fontFamily: '"Cairo", "Segoe UI", Tahoma, Arial, sans-serif',
        direction: 'rtl',
        lineHeight: '1.6',
        color: '#2d3748'
      }}
      id="invoice-template"
    >
      {/* Letterhead Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 30px',
        textAlign: 'center',
        marginBottom: '40px',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{ position: 'relative', zIndex: '2' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>📄</div>
          <h1 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '42px',
            fontWeight: '800',
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>فـــاتــورة</h1>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '24px', 
            fontWeight: '300',
            opacity: '0.95'
          }}>شركة لبان الغزال العلاجية</h2>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '12px 24px',
            borderRadius: '25px',
            display: 'inline-block',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ 
              margin: '0', 
              fontSize: '16px',
              fontWeight: '500'
            }}>
              📅 تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                calendar: 'gregory'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* معلومات الطلب */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '15px 15px 0 0',
          marginBottom: '0'
        }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📋 معلومات الطلب
          </h3>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          padding: '25px',
          backgroundColor: '#f8fafc',
          borderRadius: '0 0 15px 15px',
          border: '1px solid #e2e8f0',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            borderRight: '4px solid #667eea',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>🏷️</span>
              <strong style={{ color: '#667eea', fontSize: '14px' }}>رقم الطلب</strong>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748' }}>#{order.order_number || order.id}</span>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            borderRight: '4px solid #764ba2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>📅</span>
              <strong style={{ color: '#764ba2', fontSize: '14px' }}>تاريخ الطلب</strong>
            </div>
            <span style={{ fontSize: '16px', color: '#2d3748' }}>{formatDate(order.created_at)}</span>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            borderRight: '4px solid #10b981',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <strong style={{ color: '#10b981', fontSize: '14px' }}>حالة الطلب</strong>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>{statusConfig[order.status]?.label || 'غير محدد'}</span>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            borderRight: '4px solid #f59e0b',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>💳</span>
              <strong style={{ color: '#f59e0b', fontSize: '14px' }}>طريقة الدفع</strong>
            </div>
            <span style={{ fontSize: '16px', color: '#2d3748' }}>{order.payment_method || 'غير محدد'}</span>
          </div>
        </div>
      </div>

      {/* معلومات العميل */}
      {order.client && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '15px 15px 0 0',
            marginBottom: '0'
          }}>
            <h3 style={{ 
              margin: '0',
              fontSize: '20px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              👤 معلومات العميل
            </h3>
          </div>
          <div style={{ 
            padding: '25px',
            backgroundColor: '#f0fdf4',
            borderRadius: '0 0 15px 15px',
            border: '1px solid #bbf7d0',
            direction: 'rtl',
            textAlign: 'right'
          }}>
            <div style={{ 
              marginBottom: '15px', 
              padding: '18px 20px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              borderRight: '4px solid #10b981',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '22px' }}>👨‍💼</span>
              <div>
                <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600', marginBottom: '4px' }}>الاسم</div>
                <div style={{ fontSize: '16px', color: '#2d3748', fontWeight: '500' }}>{order.client.name || 'غير محدد'}</div>
              </div>
            </div>
            <div style={{ 
              marginBottom: '15px', 
              padding: '18px 20px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              borderRight: '4px solid #3b82f6',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '22px' }}>📧</span>
              <div>
                <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600', marginBottom: '4px' }}>البريد الإلكتروني</div>
                <div style={{ fontSize: '16px', color: '#2d3748', fontWeight: '500' }}>{order.client.email || 'غير محدد'}</div>
              </div>
            </div>
            <div style={{ 
              marginBottom: '0', 
              padding: '18px 20px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              borderRight: '4px solid #f59e0b',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '22px' }}>📱</span>
              <div>
                <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600', marginBottom: '4px' }}>رقم الهاتف</div>
                <div style={{ fontSize: '16px', color: '#2d3748', fontWeight: '500' }}>{order.client.phone || 'غير محدد'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* عنوان الشحن */}
      {order.address && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '15px 15px 0 0',
            marginBottom: '0'
          }}>
            <h3 style={{ 
              margin: '0',
              fontSize: '20px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📍 عنوان الشحن
            </h3>
          </div>
          <div style={{ 
            padding: '25px', 
            backgroundColor: '#faf5ff', 
            borderRadius: '0 0 15px 15px',
            border: '1px solid #d8b4fe',
            direction: 'rtl',
            textAlign: 'right'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              borderRight: '4px solid #8b5cf6',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '15px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>🏠</span>
                <div style={{ flex: '1' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '8px' }}>
                    {order.address.formatted_address || order.address.address_line1 || 'غير محدد'}
                  </div>
                  {order.address.address_line2 && (
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      {order.address.address_line2}
                    </div>
                  )}
                  {order.address.postal_code && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📮</span>
                      <span style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '600' }}>الرمز البريدي:</span>
                      <span style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>{order.address.postal_code}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* عناصر الطلب */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '15px 15px 0 0',
          marginBottom: '0'
        }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🛒 عناصر الطلب
          </h3>
        </div>
        
        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '0 0 15px 15px',
          border: '1px solid #fed7aa',
          overflow: 'hidden'
        }}>
          {/* جدول العناصر */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            direction: 'rtl',
            textAlign: 'right',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: 'white' 
              }}>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'right', 
                  fontSize: '16px',
                  fontWeight: '700',
                  borderBottom: '2px solid #d97706'
                }}>
                  🏷️ المنتج
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'center', 
                  fontSize: '16px',
                  fontWeight: '700',
                  borderBottom: '2px solid #d97706'
                }}>
                  📦 الكمية
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'center', 
                  fontSize: '16px',
                  fontWeight: '700',
                  borderBottom: '2px solid #d97706'
                }}>
                  💰 السعر الواحد
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'center', 
                  fontSize: '16px',
                  fontWeight: '700',
                  borderBottom: '2px solid #d97706'
                }}>
                  💵 الإجمالي
                </th>
              </tr>
            </thead>
            <tbody>
              {/* المنتجات */}
              {order.products && order.products.filter(product => !product.deleted_at && product.product_name !== "منتج محذوف").map((item, index) => (
                <tr key={`product-${index}`} style={{ 
                  backgroundColor: index % 2 === 0 ? '#fefcfb' : 'white',
                  borderBottom: '1px solid #fed7aa',
                  transition: 'background-color 0.2s ease'
                }}>
                  <td style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '15px',
                    color: '#2d3748',
                    fontWeight: '500'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📦</span>
                      {item.product_name || 'منتج'}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    textAlign: 'center', 
                    fontSize: '15px',
                    color: '#2d3748',
                    fontWeight: '600'
                  }}>
                    <span style={{
                      background: '#fed7aa',
                      color: '#9a3412',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {item.quantity || 1}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    textAlign: 'center', 
                    fontSize: '15px',
                    color: '#2d3748',
                    fontWeight: '500'
                  }}>
                    {formatPrice(item.unit_price || 0)}
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    textAlign: 'center', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#d97706'
                  }}>
                    {formatPrice(item.total_price || 0)}
                  </td>
                </tr>
              ))}
              
              {/* الباقات */}
              {order.packages && order.packages.filter(pkg => !pkg.deleted_at && pkg.package_name !== "باقة محذوفة (باقة)").map((item, index) => {
                const productCount = order.products ? order.products.length : 0;
                const bgIndex = productCount + index;
                return (
                  <tr key={`package-${index}`} style={{ 
                    backgroundColor: bgIndex % 2 === 0 ? '#fefcfb' : 'white',
                    borderBottom: '1px solid #fed7aa'
                  }}>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontSize: '15px',
                      color: '#2d3748',
                      fontWeight: '500'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>🎁</span>
                        {item.package_name || 'باقة'} 
                        <span style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>باقة</span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'center', 
                      fontSize: '15px',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        background: '#fed7aa',
                        color: '#9a3412',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {item.quantity || 1}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'center', 
                      fontSize: '15px',
                      color: '#2d3748',
                      fontWeight: '500'
                    }}>
                      {formatPrice(item.unit_price || 0)}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'center', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      color: '#d97706'
                    }}>
                      {formatPrice(item.total_price || 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ملخص الطلب */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '15px 15px 0 0',
          marginBottom: '0'
        }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💰 ملخص الطلب
          </h3>
        </div>
        <div style={{
          backgroundColor: '#f0fdfa',
          borderRadius: '0 0 15px 15px',
          border: '1px solid #a7f3d0',
          padding: '25px',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <div style={{ 
            maxWidth: '400px', 
            marginLeft: 'auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            {order.amounts ? (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0', 
                  borderBottom: '2px solid #f0fdfa',
                  fontSize: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🧾</span>
                    <span style={{ color: '#374151', fontWeight: '500' }}>المجموع الفرعي</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{formatPrice(order.amounts.total_amount || 0)}</span>
                </div>
                {order.amounts.shipping_cost > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0', 
                    borderBottom: '2px solid #f0fdfa',
                    fontSize: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🚚</span>
                      <span style={{ color: '#374151', fontWeight: '500' }}>رسوم الشحن</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{formatPrice(order.amounts.shipping_cost)}</span>
                  </div>
                )}
                {order.amounts.fees > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0', 
                    borderBottom: '2px solid #f0fdfa',
                    fontSize: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📄</span>
                      <span style={{ color: '#374151', fontWeight: '500' }}>رسوم إضافية</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{formatPrice(order.amounts.fees)}</span>
                  </div>
                )}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px', 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  marginTop: '15px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>💎</span>
                    <span>المبلغ الإجمالي</span>
                  </div>
                  <span style={{ fontSize: '22px' }}>{formatPrice(order.amounts.final_amount || 0)}</span>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px', 
                fontSize: '20px', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>💎</span>
                  <span>المبلغ الإجمالي</span>
                </div>
                <span style={{ fontSize: '22px' }}>{formatPrice(order.final_amount || order.total_amount || 0)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الملاحظات */}
      {order.notes && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '15px 15px 0 0',
            marginBottom: '0'
          }}>
            <h3 style={{ 
              margin: '0',
              fontSize: '20px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📝 ملاحظات الطلب
            </h3>
          </div>
          <div style={{ 
            padding: '25px', 
            backgroundColor: '#f8faff', 
            borderRadius: '0 0 15px 15px',
            border: '1px solid #c7d2fe'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              borderRight: '4px solid #6366f1',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
              fontStyle: 'italic'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px', marginTop: '2px' }}>💭</span>
                <div>{order.notes}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '60px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 30px',
        borderRadius: '20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{ position: 'relative', zIndex: '2' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            🙏
          </div>
          <h2 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '28px', 
            fontWeight: '700',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            شكراً لك على ثقتك بنا!
          </h2>
          <p style={{ 
            margin: '0 0 20px 0', 
            fontSize: '16px',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            نحن ممتنون لاختيارك منتجاتنا الطبيعية العالية الجودة
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '15px 25px',
            borderRadius: '25px',
            display: 'inline-block',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <p style={{ 
              margin: '0', 
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🌿 شركة لبان الغزال العلاجية © {new Date().getFullYear()}
            </p>
            <p style={{ 
              margin: '5px 0 0 0', 
              fontSize: '12px',
              opacity: '0.8'
            }}>
              📧 support@lubanelgazal.com | 📱 +966 XX XXX XXXX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 📋 صفحة تفاصيل الطلب المنفرد
 * تعرض جميع تفاصيل الطلب مع إمكانية إدارته
 */
const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { token } = useAuthStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showShippingTracker, setShowShippingTracker] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loadingShippingInfo, setLoadingShippingInfo] = useState(false);
  const invoiceRef = useRef(null);

  // استخدام hook طلب واحد
  const {
    order,
    loading,
    error,
    fetchOrder,
    cancelOrder: cancelOrderAction,
    canCancel,
    getStatusLabel,
    getStatusColor
  } = useOrder(orderId);

  // تكوين الحالات مع الألوان والأيقونات
  const statusConfig = {
    pending: { label: "في انتظار التأكيد", color: "#f39c12", icon: <FaClock /> },
    confirmed: { label: "مؤكد", color: "#3498db", icon: <FaCheckCircle /> },
    processing: { label: "قيد التجهيز", color: "#9b59b6", icon: <FaBox /> },
    shipped: { label: "تم الشحن", color: "#e67e22", icon: <FaTruck /> },
    delivered: { label: "تم التسليم", color: "#27ae60", icon: <FaCheckCircle /> },
    cancelled: { label: "ملغى", color: "#e74c3c", icon: <FaTimes /> },
    canceled: { label: "ملغى", color: "#e74c3c", icon: <FaTimes /> }, // حالة إضافية للتأكد
    rejected: { label: "مرفوض", color: "#e74c3c", icon: <FaTimes /> },
    failed: { label: "فشل", color: "#e74c3c", icon: <FaTimes /> },
    refunded: { label: "مسترد", color: "#8e44ad", icon: <FaCheckCircle /> },
  };

  // تحميل معلومات الشحن
  const fetchShippingInfo = async () => {
    if (!order || !token) return;
    
    setLoadingShippingInfo(true);
    try {
      const result = await getOrderShippingInfo(order.id, token);
      if (result.success) {
        setShippingInfo(result.data);
      } else {
      }
    } catch (error) {
    } finally {
      setLoadingShippingInfo(false);
    }
  };

  // تحميل معلومات الشحن عند تحميل الطلب
  useEffect(() => {
    if (order && token) {
      fetchShippingInfo();
    }
  }, [order, token]);

  // التعامل مع إلغاء الطلب
  const handleCancelOrder = async (reason) => {
    try {
      const success = await cancelOrderAction(reason);
      
      if (success) {
        toast.success('تم إلغاء الطلب بنجاح');
        setShowCancelModal(false);
      } else {
        toast.error('فشل في إلغاء الطلب');
      }
    } catch (err) {
      toast.error(err.message || 'حدث خطأ في إلغاء الطلب');
    }
  };

  // تحميل الفاتورة كـ PDF
  const handleDownloadInvoice = async () => {
    if (!order) {
      toast.error('لا توجد بيانات طلب لإنشاء الفاتورة');
      return;
    }
    
    setDownloadLoading(true);
    
    try {
      
      // إنشاء مكون الفاتورة مؤقتاً في DOM
      const invoiceElement = document.createElement('div');
      document.body.appendChild(invoiceElement);
      
      // رندر مكون الفاتورة باستخدام ReactDOM.render
      const ReactDOM = await import('react-dom');
      ReactDOM.render(
        <InvoiceTemplate 
          order={order} 
          formatPrice={formatPrice} 
          formatDate={formatDate} 
          statusConfig={statusConfig} 
        />,
        invoiceElement
      );
      
      // انتظار قصير للتأكد من اكتمال الرندر
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // العثور على عنصر الفاتورة المرندر
      const invoiceTemplateElement = document.getElementById('invoice-template');
      
      if (!invoiceTemplateElement) {
        throw new Error('فشل في إنشاء مكون الفاتورة');
      }
      
      // تحويل HTML إلى canvas
      const canvas = await html2canvas(invoiceTemplateElement, {
        scale: 2, // جودة عالية
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: invoiceTemplateElement.scrollHeight, // استخدام الارتفاع الفعلي للمحتوى
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // التأكد من أن النصوص العربية تظهر بشكل صحيح
          const clonedElement = clonedDoc.getElementById('invoice-template');
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
            clonedElement.style.position = 'static';
            clonedElement.style.left = 'auto';
            clonedElement.style.top = 'auto';
          }
        }
      });
      
      // إنشاء PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // إضافة الصورة إلى PDF
      const imgData = canvas.toDataURL('image/png');
      
      // إذا كان الارتفاع أقل من أو يساوي صفحة واحدة
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // إذا كان أكبر من صفحة واحدة، قسم الصورة على صفحات متعددة
        let yPosition = 0;
        let remainingHeight = imgHeight;
        
        while (remainingHeight > 0) {
          if (yPosition > 0) {
            pdf.addPage();
          }
          
          const heightToAdd = Math.min(pageHeight, remainingHeight);
          pdf.addImage(imgData, 'PNG', 0, -yPosition, imgWidth, imgHeight);
          
          yPosition += pageHeight;
          remainingHeight -= pageHeight;
        }
      }
      
      // حفظ PDF
      const fileName = `invoice-${order.order_number || order.id}.pdf`;
      pdf.save(fileName);
      
      // تنظيف DOM
      ReactDOM.unmountComponentAtNode(invoiceElement);
      document.body.removeChild(invoiceElement);
      
      toast.success('تم تحميل الفاتورة بنجاح');
      
    } catch (error) {
      toast.error(`حدث خطأ في تحميل الفاتورة: ${error.message}`);
    } finally {
      setDownloadLoading(false);
    }
  };

  // تنسيق الأسعار

  // تنسيق التاريخ بالميلادي
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'غير محدد';
      
      // عرض التاريخ بالميلادي باللغة العربية
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        calendar: 'gregory' // التقويم الميلادي
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.loadingState}>
            <FaSpinner className={styles.loadingSpinner} />
            <h3>جاري تحميل تفاصيل الطلب...</h3>
            <p>يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.errorState}>
            <FaExclamationCircle className={styles.errorIcon} />
            <h3>حدث خطأ</h3>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button className={styles.retryButton} onClick={fetchOrder}>
                <FaSpinner />
                إعادة المحاولة
              </button>
              <button className={styles.backButton} onClick={() => navigate('/order')}>
                <FaArrowLeft />
                العودة للطلبات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يوجد الطلب
  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.notFoundState}>
            <FaBox className={styles.notFoundIcon} />
            <h3>الطلب غير موجود</h3>
            <p>لم يتم العثور على الطلب المطلوب</p>
            <button className={styles.backButton} onClick={() => navigate('/order')}>
              <FaArrowLeft />
              العودة للطلبات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate('/order')}>
            <FaArrowLeft />
            العودة للطلبات
          </button>
          
          <div className={styles.headerContent}>
            <div className={styles.orderTitle}>
              <h1>#{order.order_number || order.id}</h1>
                             <span 
                 className={styles.orderStatus}
                 style={{ backgroundColor: getStatusColor(order.status) || statusConfig[order.status]?.color }}
                 title={`الحالة الفعلية: ${order.status}`} // للمساعدة في التشخيص
               >
                 {statusConfig[order.status]?.icon}
                 {statusConfig[order.status]?.label || order.status_label || getStatusLabel(order.status) || 'غير محدد'}
               </span>
            </div>
            
                         <div className={styles.orderActions}>
               {canCancel && (
                 <button 
                   className={styles.cancelButton}
                   onClick={() => setShowCancelModal(true)}
                   disabled={loading || downloadLoading}
                 >
                   <FaTimesCircle />
                   إلغاء الطلب
                 </button>
               )}
               <button 
                 className={styles.downloadButton}
                 onClick={handleDownloadInvoice}
                 disabled={loading || downloadLoading}
               >
                 {downloadLoading ? <FaSpinner className={styles.spin} /> : <FaDownload />}
                 {downloadLoading ? 'جاري إنشاء الفاتورة...' : 'تحميل الفاتورة'}
               </button>
             </div>
          </div>
        </div>

        <div className={styles.orderContent}>
          {/* Order Info Card */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>معلومات الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>رقم الطلب:</span>
                  <span className={styles.infoValue}>#{order.order_number || order.id}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>تاريخ الطلب:</span>
                  <span className={styles.infoValue}>
                    <FaCalendarAlt />
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>آخر تحديث:</span>
                  <span className={styles.infoValue}>
                    <FaCalendarAlt />
                    {formatDate(order.updated_at)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>طريقة الدفع:</span>
                  <span className={styles.infoValue}>
                    <FaCreditCard />
                    {order.payment_method || 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.client && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>معلومات العميل</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerDetail}>
                    <strong>الاسم:</strong> {order.client.name}
                  </div>
                  <div className={styles.customerDetail}>
                    <strong>البريد الإلكتروني:</strong> {order.client.email}
                  </div>
                  <div className={styles.customerDetail}>
                    <strong>رقم الهاتف:</strong>
                    <span className={styles.phoneNumber}>
                      <FaPhone />
                      {order.client.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.address && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>عنوان الشحن</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.addressInfo}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div className={styles.addressDetails}>
                    <p>{order.address.formatted_address || 
                       `${order.address.address_line1}, ${order.address.city}, ${order.address.country}`}</p>
                    {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                    {order.address.postal_code && (
                      <p><strong>الرمز البريدي:</strong> {order.address.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Tracking */}
          {(order.status === 'shipped' || order.status === 'delivered' || shippingInfo) && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>تتبع الشحن</h2>
                {shippingInfo?.tracking_number && (
                  <button 
                    className={styles.trackButton}
                    onClick={() => setShowShippingTracker(true)}
                    disabled={loadingShippingInfo}
                  >
                    {loadingShippingInfo ? (
                      <FaSpinner className={styles.spin} />
                    ) : (
                      <FaEye />
                    )}
                    {loadingShippingInfo ? 'جاري التحميل...' : 'تتبع الشحن'}
                  </button>
                )}
              </div>
              <div className={styles.cardBody}>
                {loadingShippingInfo ? (
                  <div className={styles.loadingShipping}>
                    <FaSpinner className={styles.spin} />
                    <p>جاري تحميل معلومات الشحن...</p>
                  </div>
                ) : shippingInfo ? (
                  <div className={styles.shippingInfo}>
                    <div className={styles.shippingDetail}>
                      <strong>رقم التتبع:</strong>
                      <span className={styles.trackingNumber}>
                        <FaShippingFast />
                        {shippingInfo.tracking_number}
                      </span>
                    </div>
                    {shippingInfo.shipping_reference && (
                      <div className={styles.shippingDetail}>
                        <strong>رقم الشحن المرجعي:</strong>
                        <span>{shippingInfo.shipping_reference}</span>
                      </div>
                    )}
                    {shippingInfo.shipping_status && (
                      <div className={styles.shippingDetail}>
                        <strong>حالة الشحن:</strong>
                        <span className={styles.shippingStatus}>
                          <FaTruck />
                          {shippingInfo.shipping_status}
                        </span>
                      </div>
                    )}
                    {shippingInfo.shipping_created_at && (
                      <div className={styles.shippingDetail}>
                        <strong>تاريخ إنشاء الشحن:</strong>
                        <span>{formatDate(shippingInfo.shipping_created_at)}</span>
                      </div>
                    )}
                    {shippingInfo.consignment_number && (
                      <div className={styles.shippingDetail}>
                        <strong>رقم الإرسالية:</strong>
                        <span>{shippingInfo.consignment_number}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.noShippingInfo}>
                    <FaTruck className={styles.noShippingIcon} />
                    <p>لم يتم إنشاء شحن لهذا الطلب بعد</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>عناصر الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.itemsList}>
                {/* Products */}
                {order.products && order.products.filter(product => !product.deleted_at && product.product_name !== "منتج محذوف").map((item, index) => (
                  <div key={`product-${index}`} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      {item.product_image ? (
                        <img loading="lazy" src={item.product_image} alt={item.product_name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <FaBox />
                        </div>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.product_name}</h4>
                      {item.product_description && (
                        <p className={styles.itemDescription}>{item.product_description}</p>
                      )}
                      <div className={styles.itemMeta}>
                        <span>الكمية: {item.quantity}</span>
                        <span>السعر الواحد: {formatPrice(item.unit_price)}</span>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.total_price)}
                    </div>
                  </div>
                ))}

                {/* Packages */}
                {order.packages && order.packages.filter(pkg => !pkg.deleted_at && pkg.package_name !== "باقة محذوفة (باقة)").map((item, index) => (
                  <div key={`package-${index}`} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      <div className={styles.packageIcon}>
                        <FaBox />
                      </div>
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.package_name} (باقة)</h4>
                      {item.package_description && (
                        <p className={styles.itemDescription}>{item.package_description}</p>
                      )}
                      <div className={styles.itemMeta}>
                        <span>الكمية: {item.quantity}</span>
                        <span>السعر الواحد: {formatPrice(item.unit_price)}</span>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.total_price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>ملخص الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              {order.amounts ? (
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>المجموع الفرعي:</span>
                    <span>{formatPrice(order.amounts.total_amount)}</span>
                  </div>
                  {order.amounts.shipping_cost > 0 && (
                    <div className={styles.summaryRow}>
                      <span>رسوم الشحن:</span>
                      <span>{formatPrice(order.amounts.shipping_cost)}</span>
                    </div>
                  )}
                  {order.amounts.fees > 0 && (
                    <div className={styles.summaryRow}>
                      <span>رسوم إضافية:</span>
                      <span>{formatPrice(order.amounts.fees)}</span>
                    </div>
                  )}
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>المبلغ الإجمالي:</span>
                    <span>{formatPrice(order.amounts.final_amount)}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.summaryDetails}>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>المبلغ الإجمالي:</span>
                    <span>{formatPrice(order.final_amount || order.total_amount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>ملاحظات الطلب</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.notesContent}>
                  <FaStickyNote className={styles.notesIcon} />
                  <p>{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancel Order Modal */}
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
          order={order}
          loading={loading}
        />

        {/* مكون الفاتورة المخفي - يتم استخدامه عند التحميل */}
        {order && (
          <InvoiceTemplate 
            order={order} 
            formatPrice={formatPrice} 
            formatDate={formatDate} 
            statusConfig={statusConfig} 
          />
        )}

        {/* مكون تتبع الشحن */}
        {showShippingTracker && shippingInfo?.tracking_number && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <ShippingTracker
                trackingNumber={shippingInfo.tracking_number}
                onClose={() => setShowShippingTracker(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 