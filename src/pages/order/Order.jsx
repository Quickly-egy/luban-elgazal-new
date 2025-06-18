import React, { useState } from "react";
import {
    FaBox,
    FaCheckCircle,
    FaTruck,
    FaClock,
    FaTimes,
    FaEye,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
} from "react-icons/fa";
import styles from "./Order.module.css";

export default function Order() {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Mock orders data
    const orders = [
        {
            id: "ORD-2024-001",
            date: "2024-01-15",
            items: [
                { name: "باقة العناية بالشعر", quantity: 2, price: 3750 },
                { name: "كريم الوجه المرطب", quantity: 1, price: 2500 },
            ],
            total: 10000,
            status: "delivered",
            deliveryAddress: "الرياض، حي النخيل، شارع الملك فهد",
            phone: "+966 50 123 4567",
            estimatedDelivery: "2024-01-18",
        },
        {
            id: "ORD-2024-002",
            date: "2024-01-20",
            items: [
                { name: "زيت الأرغان الطبيعي", quantity: 1, price: 5500 },
                { name: "شامبو الأعشاب", quantity: 3, price: 1800 },
            ],
            total: 10900,
            status: "shipped",
            deliveryAddress: "جدة، حي الصفا، شارع التحلية",
            phone: "+966 55 987 6543",
            estimatedDelivery: "2024-01-23",
        },
        {
            id: "ORD-2024-003",
            date: "2024-01-22",
            items: [{ name: "مجموعة العناية الكاملة", quantity: 1, price: 8900 }],
            total: 8900,
            status: "processing",
            deliveryAddress: "الدمام، حي الفيصلية، شارع الأمير محمد",
            phone: "+966 56 456 7890",
            estimatedDelivery: "2024-01-26",
        },
        {
            id: "ORD-2024-004",
            date: "2024-01-25",
            items: [
                { name: "كريم مكافحة الشيخوخة", quantity: 2, price: 4200 },
                { name: "تونر الوجه المنعش", quantity: 1, price: 2800 },
            ],
            total: 11200,
            status: "pending",
            deliveryAddress: "الخبر، حي الثقبة، شارع الكورنيش",
            phone: "+966 50 111 2222",
            estimatedDelivery: "2024-01-29",
        },
        {
            id: "ORD-2024-005",
            date: "2024-01-10",
            items: [{ name: "سيروم فيتامين سي", quantity: 1, price: 3900 }],
            total: 3900,
            status: "cancelled",
            deliveryAddress: "مكة المكرمة، حي العزيزية، شارع إبراهيم الخليل",
            phone: "+966 55 333 4444",
            estimatedDelivery: "2024-01-13",
        },
    ];

    const statusConfig = {
        pending: { label: "قيد الانتظار", color: "#f39c12", icon: <FaClock /> },
        processing: { label: "قيد المعالجة", color: "#3498db", icon: <FaBox /> },
        shipped: { label: "تم الشحن", color: "#9b59b6", icon: <FaTruck /> },
        delivered: {
            label: "تم التسليم",
            color: "#27ae60",
            icon: <FaCheckCircle />,
        },
        cancelled: { label: "ملغي", color: "#e74c3c", icon: <FaTimes /> },
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            selectedStatus === "all" || order.status === selectedStatus;
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        return matchesStatus && matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPrice = (price) => {
        return `${price.toLocaleString("en-US")} ر.س`;
    };

    return (
        <div className={styles.orderPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaBox />
                        </div>
                        <div className={styles.headerText}>
                            <h1>طلباتي</h1>
                            <p>تتبع وإدارة جميع طلباتك</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="البحث في الطلبات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.statusFilters}>
                        <button
                            className={`${styles.filterBtn} ${selectedStatus === "all" ? styles.active : ""
                                }`}
                            onClick={() => setSelectedStatus("all")}
                        >
                            <FaFilter />
                            الكل
                        </button>
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <button
                                key={status}
                                className={`${styles.filterBtn} ${selectedStatus === status ? styles.active : ""
                                    }`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {config.icon}
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className={styles.ordersContainer}>
                    {filteredOrders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaBox className={styles.emptyIcon} />
                            <h3>لا توجد طلبات</h3>
                            <p>لم يتم العثور على طلبات تطابق البحث المحدد</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                {/* Order Header */}
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <h3 className={styles.orderId}>#{order.id}</h3>
                                        <div className={styles.orderMeta}>
                                            <span className={styles.orderDate}>
                                                <FaCalendarAlt />
                                                {formatDate(order.date)}
                                            </span>
                                            <span className={styles.orderTotal}>
                                                المجموع: {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.orderActions}>
                                        <span
                                            className={styles.orderStatus}
                                            style={{
                                                backgroundColor: statusConfig[order.status].color,
                                            }}
                                        >
                                            {statusConfig[order.status].icon}
                                            {statusConfig[order.status].label}
                                        </span>
                                        <button className={styles.viewBtn}>
                                            <FaEye />
                                            عرض التفاصيل
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className={styles.orderItems}>
                                    {order.items.map((item, index) => (
                                        <div key={index} className={styles.orderItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemQuantity}>
                                                    الكمية: {item.quantity}
                                                </span>
                                            </div>
                                            <span className={styles.itemPrice}>
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Info */}
                                <div className={styles.deliveryInfo}>
                                    <div className={styles.deliveryAddress}>
                                        <FaMapMarkerAlt className={styles.deliveryIcon} />
                                        <div>
                                            <span className={styles.deliveryLabel}>
                                                عنوان التسليم:
                                            </span>
                                            <span className={styles.deliveryText}>
                                                {order.deliveryAddress}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.deliveryPhone}>
                                        <FaPhone className={styles.deliveryIcon} />
                                        <span>{order.phone}</span>
                                    </div>
                                    {order.status !== "delivered" &&
                                        order.status !== "cancelled" && (
                                            <div className={styles.estimatedDelivery}>
                                                <FaTruck className={styles.deliveryIcon} />
                                                <span>
                                                    التسليم المتوقع: {formatDate(order.estimatedDelivery)}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
