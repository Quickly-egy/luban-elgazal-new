import React, { useState, useEffect } from 'react';
import styles from './OrderSuccess.module.css';

const PDFDownloadButton = ({ orderDetails }) => {
  const [PDFComponents, setPDFComponents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPDFComponents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [reactPDF, InvoicePDFModule] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./InvoicePDF")
      ]);
      
      setPDFComponents({
        PDFDownloadLink: reactPDF.PDFDownloadLink,
        InvoicePDF: InvoicePDFModule.default
      });
    } catch (error) {
      console.error("Error loading PDF components:", error);
      setError("حدث خطأ في تحميل مكون PDF");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // تحميل مكونات PDF عند تحميل المكون
    loadPDFComponents();
  }, []);

  if (error) {
    return (
      <div className={styles.downloadButton} style={{ opacity: 0.6 }}>
        <span>عذراً، غير متاح حالياً</span>
      </div>
    );
  }

  if (isLoading || !PDFComponents) {
    return (
      <div className={styles.downloadButton} style={{ opacity: 0.6 }}>
        <span>جاري تحميل مكون PDF...</span>
      </div>
    );
  }

  return (
    <PDFComponents.PDFDownloadLink
      document={<PDFComponents.InvoicePDF order={orderDetails} />}
      fileName={`فاتورة_${orderDetails.client.name}.pdf`}
      className={styles.downloadButton}
    >
      {({ loading }) =>
        loading ? "جاري تجهيز الفاتورة..." : "تحميل الفاتورة PDF"
      }
    </PDFComponents.PDFDownloadLink>
  );
};

export default PDFDownloadButton; 