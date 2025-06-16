import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaTicketAlt,
    FaFlag,
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaHeadset,
    FaPaperPlane,
    FaFileUpload,
    FaDownload,
    FaCheckCircle,
    FaExclamationCircle,
    FaTimes
} from 'react-icons/fa';
import styles from './TicketDetails.module.css';

export default function TicketDetails() {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState(null);

    // Mock ticket data - in real app, fetch by ticketId
    const ticket = {
        id: ticketId || 'TKT-2024-001',
        subject: 'مشكلة في تسجيل الدخول',
        priority: 'high',
        status: 'open',
        createdDate: '2024-01-20',
        updatedDate: '2024-01-22',
        description: 'لا أستطيع تسجيل الدخول إلى حسابي رغم إدخال البيانات الصحيحة',
        customer: {
            name: 'أحمد محمد',
            email: 'ahmed@example.com'
        }
    };

    // Mock conversation data
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'customer',
            sender: 'أحمد محمد',
            message: 'لا أستطيع تسجيل الدخول إلى حسابي رغم إدخال البيانات الصحيحة. جربت إعادة تعيين كلمة المرور لكن المشكلة ما زالت موجودة.',
            timestamp: '2024-01-20 14:30',
            attachment: null
        },
        {
            id: 2,
            type: 'support',
            sender: 'فريق الدعم الفني',
            message: 'مرحباً أحمد، شكراً لتواصلك معنا. نحن نأسف للمشكلة التي تواجهها. هل يمكنك إخبارنا بالمتصفح الذي تستخدمه وإذا كنت تحصل على أي رسائل خطأ محددة؟',
            timestamp: '2024-01-20 15:45',
            attachment: null
        },
        {
            id: 3,
            type: 'customer',
            sender: 'أحمد محمد',
            message: 'أستخدم متصفح Chrome الإصدار الأحدث. الرسالة التي تظهر هي "كلمة المرور غير صحيحة" رغم أنني متأكد من صحتها.',
            timestamp: '2024-01-21 09:15',
            attachment: null
        },
        {
            id: 4,
            type: 'support',
            sender: 'فريق الدعم الفني',
            message: 'شكراً لك على المعلومات. يبدو أن هناك مشكلة في نظام المصادقة. قمنا بإعادة تعيين حسابك. يرجى المحاولة مرة أخرى باستخدام كلمة المرور الجديدة المرسلة إلى بريدك الإلكتروني.',
            timestamp: '2024-01-21 11:30',
            attachment: {
                name: 'كلمة_المرور_الجديدة.pdf',
                size: '15 KB'
            }
        }
    ]);

    const priorityConfig = {
        low: { label: 'منخفضة', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)' },
        medium: { label: 'متوسطة', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)' },
        high: { label: 'عالية', color: '#fd7e14', bgColor: 'rgba(253, 126, 20, 0.1)' },
        urgent: { label: 'عاجلة', color: '#dc3545', bgColor: 'rgba(220, 53, 69, 0.1)' }
    };

    const statusConfig = {
        open: { label: 'مفتوحة', color: '#007bff', bgColor: 'rgba(0, 123, 255, 0.1)', icon: <FaExclamationCircle /> },
        'in-progress': { label: 'قيد المعالجة', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)', icon: <FaClock /> },
        closed: { label: 'مغلقة', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)', icon: <FaCheckCircle /> }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachment) return;

        const message = {
            id: messages.length + 1,
            type: 'customer',
            sender: ticket.customer.name,
            message: newMessage.trim(),
            timestamp: new Date().toLocaleString('ar-SA'),
            attachment: attachment
        };

        setMessages([...messages, message]);
        setNewMessage('');
        setAttachment(null);

        // Reset file input
        const fileInput = document.getElementById('messageAttachment');
        if (fileInput) fileInput.value = '';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment({
                name: file.name,
                size: `${Math.round(file.size / 1024)} KB`
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.ticketDetailsPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.pageHeader}>
                    <button className={styles.backBtn} onClick={() => navigate('/tickets')}>
                        <FaArrowLeft />
                        العودة للتذاكر
                    </button>
                    <div className={styles.ticketInfo}>
                        <div className={styles.ticketNumber}>
                            <FaTicketAlt />
                            <span>#{ticket.id}</span>
                        </div>
                        <h1 className={styles.ticketSubject}>{ticket.subject}</h1>
                    </div>
                </div>

                {/* Ticket Summary */}
                <div className={styles.ticketSummary}>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <label>الأولوية</label>
                            <span
                                className={styles.priorityBadge}
                                style={{
                                    color: priorityConfig[ticket.priority].color,
                                    backgroundColor: priorityConfig[ticket.priority].bgColor
                                }}
                            >
                                <FaFlag />
                                {priorityConfig[ticket.priority].label}
                            </span>
                        </div>
                        <div className={styles.summaryItem}>
                            <label>الحالة</label>
                            <span
                                className={styles.statusBadge}
                                style={{
                                    color: statusConfig[ticket.status].color,
                                    backgroundColor: statusConfig[ticket.status].bgColor
                                }}
                            >
                                {statusConfig[ticket.status].icon}
                                {statusConfig[ticket.status].label}
                            </span>
                        </div>
                        <div className={styles.summaryItem}>
                            <label>تاريخ الإنشاء</label>
                            <span>
                                <FaCalendarAlt />
                                {formatDate(ticket.createdDate)}
                            </span>
                        </div>
                        <div className={styles.summaryItem}>
                            <label>آخر تحديث</label>
                            <span>
                                <FaClock />
                                {formatDate(ticket.updatedDate)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className={styles.chatContainer}>
                    {/* Messages */}
                    <div className={styles.messagesContainer}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.messageWrapper} ${message.type === 'customer' ? styles.customerMessage : styles.supportMessage
                                    }`}
                            >
                                <div className={styles.messageContent}>
                                    <div className={styles.messageHeader}>
                                        <div className={styles.senderInfo}>
                                            <div className={styles.senderAvatar}>
                                                {message.type === 'customer' ? <FaUser /> : <FaHeadset />}
                                            </div>
                                            <span className={styles.senderName}>{message.sender}</span>
                                        </div>
                                        <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                                    </div>
                                    <div className={styles.messageBody}>
                                        <p>{message.message}</p>
                                        {message.attachment && (
                                            <div className={styles.attachment}>
                                                <FaDownload />
                                                <span>{message.attachment.name}</span>
                                                <small>({message.attachment.size})</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className={styles.messageInput}>
                        <form onSubmit={handleSendMessage} className={styles.inputForm}>
                            <div className={styles.inputContainer}>
                                <div className={styles.textInputContainer}>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="اكتب ردك هنا..."
                                        className={styles.messageTextarea}
                                        rows="3"
                                    />
                                    {attachment && (
                                        <div className={styles.attachmentPreview}>
                                            <span>{attachment.name} ({attachment.size})</span>
                                            <button
                                                type="button"
                                                onClick={() => setAttachment(null)}
                                                className={styles.removeAttachment}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.inputActions}>
                                    <input
                                        type="file"
                                        id="messageAttachment"
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="messageAttachment" className={styles.attachmentBtn}>
                                        <FaFileUpload />
                                    </label>
                                    <button type="submit" className={styles.sendBtn}>
                                        <FaPaperPlane />
                                        إرسال
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 