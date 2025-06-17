import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaTicketAlt,
    FaPlus,
    FaEye,
    FaTimes,
    FaExclamationCircle,
    FaCheckCircle,
    FaClock,
    FaFileUpload,
    FaCalendarAlt,
    FaUser,
    FaFlag,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import styles from './Tikets.module.css';
import { ticketsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Tikets() {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        priority: '',
        description: '',
        attachment: null
    });

    // Fetch tickets from API
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ticketsAPI.getTickets();

            if (response.success) {
                // Transform API data to match component structure
                const transformedTickets = response.data.data.map(ticket => ({
                    id: ticket.ticket_number,
                    subject: ticket.subject,
                    priority: ticket.priority,
                    status: ticket.status,
                    createdDate: ticket.created_at,
                    updatedDate: ticket.updated_at,
                    description: ticket.initial_message,
                    responses: parseInt(ticket.messages_count) || 0,
                    originalId: ticket.id
                }));
                setTickets(transformedTickets);
            } else {
                setError('فشل في جلب التذاكر');
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('حدث خطأ في جلب التذاكر');
        } finally {
            setLoading(false);
        }
    };

    const priorityConfig = {
        low: { label: 'منخفضة', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)' },
        medium: { label: 'متوسطة', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)' },
        high: { label: 'عالية', color: '#fd7e14', bgColor: 'rgba(253, 126, 20, 0.1)' },
        urgent: { label: 'عاجلة', color: '#dc3545', bgColor: 'rgba(220, 53, 69, 0.1)' }
    };

    const statusConfig = {
        open: { label: 'مفتوح', color: '#007bff', bgColor: 'rgba(0, 123, 255, 0.1)', icon: <FaExclamationCircle /> },
        pending: { label: 'في الانتظار', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)', icon: <FaClock /> },
        'in-progress': { label: 'قيد المعالجة', color: '#fd7e14', bgColor: 'rgba(253, 126, 20, 0.1)', icon: <FaClock /> },
        resolved: { label: 'تم الحل', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)', icon: <FaCheckCircle /> },
        closed: { label: 'مغلق', color: '#6c757d', bgColor: 'rgba(108, 117, 125, 0.1)', icon: <FaCheckCircle /> }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTicket(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewTicket(prev => ({
            ...prev,
            attachment: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const ticketData = {
                subject: newTicket.subject,
                priority: newTicket.priority,
                message: newTicket.description
            };

            // If there's an attachment, we might need to handle it differently
            // For now, we'll just send the text data
            const response = await ticketsAPI.createTicket(ticketData);

            if (response.success) {
                // Reset form and close modal
                setNewTicket({
                    subject: '',
                    priority: '',
                    description: '',
                    attachment: null
                });
                setShowCreateModal(false);

                // Refresh tickets list
                fetchTickets();

                // Show success message
                alert('تم إنشاء التذكرة بنجاح!');
            } else {
                alert('فشل في إنشاء التذكرة: ' + (response.message || 'خطأ غير معروف'));
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('حدث خطأ في إنشاء التذكرة');
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setNewTicket({
            subject: '',
            priority: '',
            description: '',
            attachment: null
        });
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewTicketDetails = (ticketId) => {
        navigate(`/tickets/${ticketId}`);
    };

    // Show loading state
    if (loading) {
        return (
            <div className={styles.ticketsPage}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerIcon}>
                                <FaTicketAlt />
                            </div>
                            <div className={styles.headerText}>
                                <h1>تذاكر الدعم الفني</h1>
                                <p>إدارة ومتابعة جميع تذاكر الدعم الفني</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className={styles.ticketsPage}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerIcon}>
                                <FaTicketAlt />
                            </div>
                            <div className={styles.headerText}>
                                <h1>تذاكر الدعم الفني</h1>
                                <p>إدارة ومتابعة جميع تذاكر الدعم الفني</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.errorState}>
                        <FaExclamationCircle className={styles.errorIcon} />
                        <h3>حدث خطأ</h3>
                        <p>{error}</p>
                        <button onClick={fetchTickets} className={styles.retryBtn}>
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.ticketsPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaTicketAlt />
                        </div>
                        <div className={styles.headerText}>
                            <h1>تذاكر الدعم الفني</h1>
                            <p>إدارة ومتابعة جميع تذاكر الدعم الفني</p>
                        </div>
                    </div>
                    <button
                        className={styles.createBtn}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaPlus />
                        إنشاء تذكرة جديدة
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="البحث في التذاكر..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.statusFilters}>
                        <button
                            className={`${styles.filterBtn} ${selectedStatus === 'all' ? styles.active : ''}`}
                            onClick={() => setSelectedStatus('all')}
                        >
                            <FaFilter />
                            الكل
                        </button>
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <button
                                key={status}
                                className={`${styles.filterBtn} ${selectedStatus === status ? styles.active : ''}`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {config.icon}
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets Table - Desktop Only */}
                <div className={styles.tableContainer}>
                    <table className={styles.ticketsTable}>
                        <thead>
                            <tr>
                                <th>رقم التذكرة</th>
                                <th>الموضوع</th>
                                <th>الأولوية</th>
                                <th>الحالة</th>
                                <th>تاريخ الإنشاء</th>
                                <th>آخر تحديث</th>
                                <th>الردود</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className={styles.ticketId}>#{ticket.id}</td>
                                    <td className={styles.ticketSubject}>{ticket.subject}</td>
                                    <td>
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
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>{formatDate(ticket.createdDate)}</td>
                                    <td>{formatDate(ticket.updatedDate)}</td>
                                    <td className={styles.responsesCount}>{ticket.responses}</td>
                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => handleViewTicketDetails(ticket.id)}
                                        >
                                            <FaEye />
                                            تفاصيل
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tickets Cards - Mobile & Tablet */}
                <div className={styles.cardsContainer}>
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className={styles.ticketCard}>
                            {/* Card Header */}
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <h3 className={styles.cardTicketId}>#{ticket.id}</h3>
                                    <div className={styles.cardBadges}>
                                        <span
                                            className={styles.cardPriorityBadge}
                                            style={{
                                                color: priorityConfig[ticket.priority].color,
                                                backgroundColor: priorityConfig[ticket.priority].bgColor
                                            }}
                                        >
                                            <FaFlag />
                                            {priorityConfig[ticket.priority].label}
                                        </span>
                                        <span
                                            className={styles.cardStatusBadge}
                                            style={{
                                                color: statusConfig[ticket.status].color,
                                                backgroundColor: statusConfig[ticket.status].bgColor
                                            }}
                                        >
                                            {statusConfig[ticket.status].icon}
                                            {statusConfig[ticket.status].label}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className={styles.cardViewBtn}
                                    onClick={() => handleViewTicketDetails(ticket.id)}
                                >
                                    <FaEye />
                                    تفاصيل
                                </button>
                            </div>

                            {/* Card Content */}
                            <div className={styles.cardContent}>
                                <h4 className={styles.cardSubject}>{ticket.subject}</h4>
                                <p className={styles.cardDescription}>{ticket.description}</p>
                            </div>

                            {/* Card Footer */}
                            <div className={styles.cardFooter}>
                                <div className={styles.cardMeta}>
                                    <div className={styles.cardMetaItem}>
                                        <FaCalendarAlt className={styles.cardMetaIcon} />
                                        <span>أنشئت: {formatDate(ticket.createdDate)}</span>
                                    </div>
                                    <div className={styles.cardMetaItem}>
                                        <FaClock className={styles.cardMetaIcon} />
                                        <span>آخر تحديث: {formatDate(ticket.updatedDate)}</span>
                                    </div>
                                </div>
                                <div className={styles.cardResponses}>
                                    <span className={styles.responsesCount}>
                                        {ticket.responses} ردود
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTickets.length === 0 && (
                    <div className={styles.emptyState}>
                        <FaTicketAlt className={styles.emptyIcon} />
                        <h3>لا توجد تذاكر</h3>
                        <p>لم يتم العثور على تذاكر تطابق البحث المحدد</p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={handleModalClose}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>إنشاء تذكرة جديدة</h3>
                            <button className={styles.closeBtn} onClick={handleModalClose}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalContent}>
                            <div className={styles.formGroup}>
                                <label>موضوع التذكرة *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={newTicket.subject}
                                    onChange={handleInputChange}
                                    placeholder="اكتب موضوع التذكرة..."
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>الأولوية *</label>
                                <select
                                    name="priority"
                                    value={newTicket.priority}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">اختر الأولوية</option>
                                    <option value="low">منخفضة</option>
                                    <option value="medium">متوسطة</option>
                                    <option value="high">عالية</option>
                                    <option value="urgent">عاجلة</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>تفاصيل المشكلة *</label>
                                <textarea
                                    name="description"
                                    value={newTicket.description}
                                    onChange={handleInputChange}
                                    placeholder="اشرح المشكلة بالتفصيل..."
                                    rows="5"
                                    required
                                ></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label>إرفاق ملف (اختياري)</label>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        id="attachment"
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                    />
                                    <label htmlFor="attachment" className={styles.fileLabel}>
                                        <FaFileUpload />
                                        {newTicket.attachment ? newTicket.attachment.name : 'اختر ملف'}
                                    </label>
                                </div>
                                <small>الملفات المسموحة: JPG, PNG, PDF, DOC, DOCX (حتى 5MB)</small>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={handleModalClose}>
                                    إلغاء
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    إنشاء التذكرة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
