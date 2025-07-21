import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaPlus,
  FaEye,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaFlag,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaCheck,
  FaHeadset,
  FaPaperPlane,
  FaFileUpload,
} from "react-icons/fa";
import styles from "./Tikets.module.css";
import useTicketsStore from "../../stores/ticketsStore";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Tikets() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [showReplySuccess, setShowReplySuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    priority: "",
    description: "",
  });

  // استخدام Zustand store
  const {
    tickets,
    loading,
    isCreating,
    error,
    createTicket,
    fetchTickets,
    sendMessage,
    clearError,
  } = useTicketsStore();

  // جلب التذاكر عند تحميل المكون
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // استخدام البيانات الحقيقية من API
  const allTickets = tickets;

  const priorityConfig = {
    low: {
      label: "منخفضة",
      color: "#28a745",
      bgColor: "rgba(40, 167, 69, 0.1)",
    },
    medium: {
      label: "متوسطة",
      color: "#ffc107",
      bgColor: "rgba(255, 193, 7, 0.1)",
    },
    high: {
      label: "عالية",
      color: "#fd7e14",
      bgColor: "rgba(253, 126, 20, 0.1)",
    },
    urgent: {
      label: "عاجلة",
      color: "#dc3545",
      bgColor: "rgba(220, 53, 69, 0.1)",
    },
  };

  const statusConfig = {
    open: {
      label: "مفتوح",
      color: "#007bff",
      bgColor: "rgba(0, 123, 255, 0.1)",
      icon: <FaExclamationCircle />,
    },
    pending: {
      label: "في الانتظار",
      color: "#ffc107",
      bgColor: "rgba(255, 193, 7, 0.1)",
      icon: <FaClock />,
    },
    "in-progress": {
      label: "قيد المعالجة",
      color: "#fd7e14",
      bgColor: "rgba(253, 126, 20, 0.1)",
      icon: <FaClock />,
    },
    resolved: {
      label: "تم الحل",
      color: "#28a745",
      bgColor: "rgba(40, 167, 69, 0.1)",
      icon: <FaCheckCircle />,
    },
    closed: {
      label: "مغلق",
      color: "#6c757d",
      bgColor: "rgba(108, 117, 125, 0.1)",
      icon: <FaCheckCircle />,
    },
  };

  // دالة مساعدة للحصول على تكوين الأولوية مع قيمة افتراضية
  const getPriorityConfig = (priority) => {
    return (
      priorityConfig[priority] || {
        label: "غير محدد",
        color: "#6c757d",
        bgColor: "rgba(108, 117, 125, 0.1)",
      }
    );
  };

  // دالة مساعدة للحصول على تكوين الحالة مع قيمة افتراضية
  const getStatusConfig = (status) => {
    return (
      statusConfig[status] || {
        label: "غير محدد",
        color: "#6c757d",
        bgColor: "rgba(108, 117, 125, 0.1)",
        icon: <FaExclamationCircle />,
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تنظيف الأخطاء السابقة
    clearError();

    try {
      // إعداد البيانات للإرسال
      const ticketData = {
        subject: newTicket.subject,
        message: newTicket.description,
        priority: newTicket.priority,
      };



      // إرسال البيانات باستخدام store
      const result = await createTicket(ticketData);

      if (result.success) {
        // إعادة تعيين النموذج وإغلاق النافذة المنبثقة
        setNewTicket({
          subject: "",
          priority: "",
          description: "",
        });
        setShowCreateModal(false);

        // إظهار تنبيه النجاح
        setShowSuccessAlert(true);

        // إخفاء التنبيه بعد 5 ثوان
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);


      } else {
        // إظهار رسالة خطأ
        alert(result.error || "حدث خطأ في إنشاء التذكرة");
      }
    } catch (error) {
    
      alert("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setNewTicket({
      subject: "",
      priority: "",
      description: "",
    });
    // تنظيف الأخطاء عند إغلاق النافذة
    clearError();
  };

  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.ticketNumber &&
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewTicketDetails = (ticketId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // البحث عن التذكرة في القائمة المحلية
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setShowDetailsModal(true);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTicket(null);
    setReplyMessage("");
    setReplyError("");
    setIsSendingReply(false);
    setShowReplySuccess(false);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      setReplyError("يرجى كتابة رسالة الرد");
      return;
    }

    setIsSendingReply(true);
    setReplyError("");

    try {


      const result = await sendMessage(selectedTicket.id, replyMessage.trim());

      if (result.success) {


        // تحديث التذكرة المختارة مع الرد الجديد
        const updatedTicket = {
          ...selectedTicket,
          responses: selectedTicket.responses + 1,
          messages: [
            ...(selectedTicket.messages || []),
            {
              id: result.data.id,
              message: result.data.message,
              senderType: result.data.sender_type,
              senderName: result.data.sender_name,
              attachments: result.data.attachment_urls || [],
              isRead: result.data.is_read,
              createdAt: result.data.created_at,
            },
          ],
        };

        setSelectedTicket(updatedTicket);
        setReplyMessage("");

        // إظهار إشعار النجاح
        setShowReplySuccess(true);

        // إخفاء الإشعار بعد 4 ثوان
        setTimeout(() => {
          setShowReplySuccess(false);
        }, 4000);
      } else {
        setReplyError(result.error || "حدث خطأ في إرسال الرد");
      }
    } catch (error) {

      setReplyError("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSendingReply(false);
    }
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
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
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <div className={styles.alertIcon}>
              <FaCheck />
            </div>
            <div className={styles.alertText}>
              <h4>تم بنجاح!</h4>
              <p>تم إنشاء التذكرة بنجاح وسيتم الرد عليها في أقرب وقت ممكن</p>
            </div>
            <button
              className={styles.alertClose}
              onClick={() => setShowSuccessAlert(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

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
              className={`${styles.filterBtn} ${
                selectedStatus === "all" ? styles.active : ""
              }`}
              onClick={() => setSelectedStatus("all")}
            >
              <FaFilter />
              الكل
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                className={`${styles.filterBtn} ${
                  selectedStatus === status ? styles.active : ""
                }`}
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
                  <td className={styles.ticketId}>
                    #{ticket.ticketNumber || ticket.id}
                  </td>
                  <td className={styles.ticketSubject}>{ticket.subject}</td>
                  <td>
                    <span
                      className={styles.priorityBadge}
                      style={{
                        color: getPriorityConfig(ticket.priority).color,
                        backgroundColor: getPriorityConfig(ticket.priority)
                          .bgColor,
                      }}
                    >
                      <FaFlag />
                      {getPriorityConfig(ticket.priority).label}
                    </span>
                  </td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{
                        color: getStatusConfig(ticket.status).color,
                        backgroundColor: getStatusConfig(ticket.status).bgColor,
                      }}
                    >
                      {getStatusConfig(ticket.status).icon}
                      {getStatusConfig(ticket.status).label}
                    </span>
                  </td>
                  <td>{ticket.date}</td>
                  <td>{ticket.lastReply}</td>
                  <td className={styles.responsesCount}>{ticket.responses}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      onClick={(e) => handleViewTicketDetails(ticket.id, e)}
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
                  <h3 className={styles.cardTicketId}>
                    #{ticket.ticketNumber || ticket.id}
                  </h3>
                  <div className={styles.cardBadges}>
                    <span
                      className={styles.cardPriorityBadge}
                      style={{
                        color: getPriorityConfig(ticket.priority).color,
                        backgroundColor: getPriorityConfig(ticket.priority)
                          .bgColor,
                      }}
                    >
                      <FaFlag />
                      {getPriorityConfig(ticket.priority).label}
                    </span>
                    <span
                      className={styles.cardStatusBadge}
                      style={{
                        color: getStatusConfig(ticket.status).color,
                        backgroundColor: getStatusConfig(ticket.status).bgColor,
                      }}
                    >
                      {getStatusConfig(ticket.status).icon}
                      {getStatusConfig(ticket.status).label}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.cardViewBtn}
                  onClick={(e) => handleViewTicketDetails(ticket.id, e)}
                >
                  <FaEye />
                  تفاصيل
                </button>
              </div>

              {/* Card Content */}
              <div className={styles.cardContent}>
                <h4 className={styles.cardSubject}>{ticket.subject}</h4>
                <p className={styles.cardDescription}>{ticket.message}</p>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.cardMeta}>
                  <div className={styles.cardMetaItem}>
                    <FaCalendarAlt className={styles.cardMetaIcon} />
                    <span>أنشئت: {ticket.date}</span>
                  </div>
                  <div className={styles.cardMetaItem}>
                    <FaClock className={styles.cardMetaIcon} />
                    <span>آخر رد: {ticket.lastReply}</span>
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

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <FaSpinner className={styles.loadingSpinner} />
            <h3>جاري تحميل التذاكر...</h3>
            <p>يرجى المتابعة</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <FaExclamationCircle className={styles.errorIcon} />
            <h3>حدث خطأ في تحميل التذاكر</h3>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={() => fetchTickets()}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTickets.length === 0 && (
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

              {/* عرض رسالة الخطأ إن وجدت */}
              {error && (
                <div className={styles.errorMessage}>
                  <FaExclamationCircle />
                  <span>{error}</span>

                  {/* نصائح لحل مشاكل الشبكة */}
                  {(error.includes("شبكة") ||
                    error.includes("اتصال") ||
                    error.includes("إنترنت")) && (
                    <div className={styles.networkTips}>
                      <strong>نصائح لحل المشكلة:</strong>
                      <ul>
                        <li>تحقق من اتصال الإنترنت</li>
                        <li>جرب إعادة تحميل الصفحة</li>
                        <li>تأكد من أن VPN غير مفعل</li>
                        <li>جرب في متصفح آخر</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleModalClose}
                  disabled={isCreating}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <FaSpinner className={styles.spinner} />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء التذكرة"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Chat Modal */}
      {showDetailsModal && selectedTicket && (
        <div className={styles.modalOverlay} onClick={handleCloseDetailsModal}>
          <div
            className={styles.chatModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Notification for Reply */}
            {showReplySuccess && (
              <div className={styles.replySuccessNotification}>
                <div className={styles.successContent}>
                  <div className={styles.successIcon}>
                    <FaCheck />
                  </div>
                  <div className={styles.successText}>
                    <h4>تم إرسال الرد بنجاح ✅</h4>
                  </div>
                  <button
                    className={styles.successClose}
                    onClick={() => setShowReplySuccess(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.ticketAvatar}>
                  <FaTicketAlt />
                </div>
                <div className={styles.ticketDetails}>
                  <h3>#{selectedTicket.ticketNumber || selectedTicket.id}</h3>
                  <p>{selectedTicket.subject}</p>
                  <div className={styles.ticketBadges}>
                    <span
                      className={styles.priorityBadge}
                      style={{
                        color: getPriorityConfig(selectedTicket.priority).color,
                        backgroundColor: getPriorityConfig(
                          selectedTicket.priority
                        ).bgColor,
                      }}
                    >
                      <FaFlag />
                      {getPriorityConfig(selectedTicket.priority).label}
                    </span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        color: getStatusConfig(selectedTicket.status).color,
                        backgroundColor: getStatusConfig(selectedTicket.status)
                          .bgColor,
                      }}
                    >
                      {getStatusConfig(selectedTicket.status).icon}
                      {getStatusConfig(selectedTicket.status).label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={styles.chatCloseBtn}
                onClick={handleCloseDetailsModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages Container */}
            <div className={styles.chatMessages}>
              {/* Initial Message from Customer */}
              <div
                className={styles.chatMessage + " " + styles.customerMessage}
              >
                <div className={styles.messageAvatar}>
                  <FaUser />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.senderName}>
                      {selectedTicket.client?.name || "العميل"}
                    </span>
                    <span className={styles.messageTime}>
                      <FaClock />
                      {selectedTicket.date}
                    </span>
                  </div>
                  <div className={styles.messageBubble}>
                    <p>{selectedTicket.message}</p>
                  </div>
                </div>
              </div>

              {/* Support Messages */}
              {selectedTicket.messages &&
                selectedTicket.messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`${styles.chatMessage} ${
                      msg.senderType === "support" ||
                      msg.senderName?.includes("دعم")
                        ? styles.supportMessage
                        : styles.customerMessage
                    }`}
                  >
                    <div className={styles.messageAvatar}>
                      {msg.senderType === "support" ||
                      msg.senderName?.includes("دعم") ? (
                        <FaHeadset />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageHeader}>
                        <span className={styles.senderName}>
                          {msg.senderName || "مجهول"}
                        </span>
                        <span className={styles.messageTime}>
                          <FaClock />
                          {msg.createdAt}
                        </span>
                      </div>
                      <div className={styles.messageBubble}>
                        <p>{msg.message}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={styles.messageAttachments}>
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className={styles.attachment}>
                                <FaFileUpload />
                                <span>{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className={styles.chatInput}>
              {replyError && (
                <div className={styles.chatError}>
                  <FaExclamationCircle />
                  <span>{replyError}</span>
                </div>
              )}

              <form onSubmit={handleSendReply} className={styles.chatForm}>
                <div className={styles.inputContainer}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    className={styles.chatTextarea}
                    disabled={isSendingReply}
                    rows="1"
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={isSendingReply || !replyMessage.trim()}
                  >
                    {isSendingReply ? (
                      <FaSpinner className={styles.spinner} />
                    ) : (
                      <FaPaperPlane />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
