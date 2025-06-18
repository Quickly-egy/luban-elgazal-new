import { create } from 'zustand';
import { ticketsAPI } from '../services/endpoints';

const useTicketsStore = create((set, get) => ({
  // State
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  isCreating: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
    from: 0,
    to: 0
  },

  // Actions
  createTicket: async (ticketData) => {
    try {
      set({ isCreating: true, error: null });
      
      console.log('🎫 ticketsStore.createTicket: بدء إنشاء تذكرة جديدة');
      console.log('📊 البيانات المرسلة:', ticketData);
      
      const response = await ticketsAPI.createTicket(ticketData);
      
      if (response.success) {
        // إضافة التذكرة الجديدة إلى القائمة
        const newTicket = response.data;
        set(state => ({
          tickets: [newTicket, ...state.tickets],
          isCreating: false,
          error: null
        }));
        
        console.log('✅ ticketsStore.createTicket: تم إنشاء التذكرة بنجاح:', newTicket);
        return { success: true, data: newTicket, message: response.message };
      } else {
        throw new Error(response.message || 'فشل في إنشاء التذكرة');
      }
    } catch (error) {
      console.error('❌ ticketsStore.createTicket: خطأ في إنشاء التذكرة:', error);
      
      let errorMessage = 'حدث خطأ في إنشاء التذكرة، يرجى المحاولة مرة أخرى';
      
      // معالجة رسائل الخطأ المحددة من API
      if (error.message.includes('TIMEOUT') || error.message.includes('CONNECTION_TIMEOUT')) {
        errorMessage = '⏰ انتهت مهلة الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى';
      } else if (error.message.includes('NETWORK_ERROR')) {
        errorMessage = '🌐 خطأ في الشبكة، يرجى التحقق من الإنترنت والمحاولة مرة أخرى';
      } else if (error.message.includes('CORS') || error.message.includes('blocked by CORS policy') || error.message.includes('CORS_ERROR')) {
        errorMessage = '🔒 مشكلة في الأمان، يرجى المحاولة لاحقاً أو الاتصال بالدعم الفني';
      } else if (error.message.includes('UNAUTHORIZED')) {
        errorMessage = '🔐 انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
      } else if (error.message.includes('VALIDATION')) {
        errorMessage = '❌ البيانات المدخلة غير صحيحة، يرجى التحقق من البيانات';
      } else if (error.message.includes('SERVER_ERROR')) {
        errorMessage = '🖥️ خطأ في الخادم، يرجى المحاولة لاحقاً';
      } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage = '🌐 خطأ في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى';
      } else if (error.message.includes('ERR_CONNECTION_TIMED_OUT')) {
        errorMessage = '⏰ انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى';
      } else if (error.message) {
        // إزالة البادئات التقنية من الرسالة للمستخدم
        errorMessage = error.message.replace(/^[A-Z_]+:\s*/, '');
      }
      
      set({ 
        isCreating: false, 
        error: errorMessage 
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Helper function to transform API ticket data
  transformTicketData: (apiTicket) => {
    // Transform date to Arabic Gregorian format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return {
      id: apiTicket.id,
      ticketNumber: apiTicket.ticket_number,
      subject: apiTicket.subject,
      message: apiTicket.initial_message,
      status: apiTicket.status,
      statusText: apiTicket.status_text,
      priority: apiTicket.priority,
      priorityText: apiTicket.priority_text,
      client: {
        name: `${apiTicket.client.first_name} ${apiTicket.client.last_name}`,
        email: apiTicket.client.email,
        phone: apiTicket.client.phone,
        country: apiTicket.client.country,
      },
      date: formatDate(apiTicket.created_at),
      lastReply: formatDate(apiTicket.last_reply_at),
      responses: parseInt(apiTicket.messages_count) || 0,
      isOverdue: apiTicket.is_overdue,
      assignedTo: apiTicket.assigned_to,
      messages: apiTicket.latest_message ? apiTicket.latest_message.map(msg => ({
        id: msg.id,
        message: msg.message,
        senderType: msg.sender_type,
        senderName: msg.sender_name,
        attachments: msg.attachment_urls || [],
        isRead: msg.is_read,
        createdAt: formatDate(msg.created_at)
      })) : []
    };
  },

  // Fetch tickets from API instead of using mock data
  fetchTickets: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    
    try {
      console.log('🔄 fetchTickets: بدء جلب التذاكر...');
      
      const response = await ticketsAPI.getTickets();
      
      if (response.success) {
        console.log('✅ fetchTickets: تم جلب التذاكر بنجاح');
        
        // Transform API data to match our component structure
        const transformedTickets = response.data.data.map(get().transformTicketData);
        
        set((state) => ({
          ...state,
          tickets: transformedTickets,
          pagination: {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            total: response.data.total,
            perPage: response.data.per_page,
            from: response.data.from,
            to: response.data.to
          },
          loading: false,
          error: null
        }));
        
        console.log(`📊 fetchTickets: تم تحميل ${transformedTickets.length} تذكرة`);
      } else {
        throw new Error(response.message || 'فشل في جلب التذاكر');
      }
    } catch (error) {
      console.error('❌ fetchTickets: خطأ في جلب التذاكر:', error);
      
      let errorMessage = 'حدث خطأ أثناء جلب التذاكر';
      
      if (error.message.includes('UNAUTHORIZED')) {
        errorMessage = '🔐 انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
      } else if (error.message.includes('NETWORK')) {
        errorMessage = '🌐 مشكلة في الاتصال بالإنترنت، يرجى التحقق من الاتصال';
      } else if (error.message.includes('SERVER_ERROR')) {
        errorMessage = '⚙️ خطأ في الخادم، يرجى المحاولة لاحقاً';
      }
      
      set((state) => ({
        ...state,
        loading: false,
        error: errorMessage
      }));
    }
  },

  fetchTicketById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await ticketsAPI.getTicketById(id);
      
      if (response.success) {
        set({ 
          currentTicket: response.data, 
          loading: false,
          error: null 
        });
        
        return response.data;
      } else {
        throw new Error(response.message || 'فشل في جلب التذكرة');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      set({ 
        loading: false, 
        error: 'حدث خطأ في جلب التذكرة' 
      });
      
      return null;
    }
  },

  sendMessage: async (ticketId, messageText) => {
    try {
      console.log('🎫 ticketsStore.sendMessage: بدء إرسال رد جديد');
      console.log('📊 التذكرة:', ticketId, 'الرسالة:', messageText);
      
      const response = await ticketsAPI.sendMessage(ticketId, messageText);
      
      if (response.success) {
        console.log('✅ ticketsStore.sendMessage: تم إرسال الرد بنجاح:', response.data);
        
        // تحديث التذكرة في القائمة المحلية
        const tickets = get().tickets;
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === parseInt(ticketId)) {
            return {
              ...ticket,
              responses: ticket.responses + 1,
              messages: [...(ticket.messages || []), {
                id: response.data.id,
                message: response.data.message,
                senderType: response.data.sender_type,
                senderName: response.data.sender_name,
                attachments: response.data.attachment_urls || [],
                isRead: response.data.is_read,
                createdAt: response.data.created_at
              }]
            };
          }
          return ticket;
        });
        
        set({ tickets: updatedTickets });
        
        return { success: true, data: response.data, message: response.message };
      } else {
        throw new Error(response.message || 'فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('❌ ticketsStore.sendMessage: خطأ في إرسال الرد:', error);
      
      let errorMessage = 'حدث خطأ في إرسال الرسالة';
      
      if (error.message.includes('UNAUTHORIZED')) {
        errorMessage = '🔐 انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
      } else if (error.message.includes('VALIDATION')) {
        errorMessage = '❌ البيانات المدخلة غير صحيحة، يرجى التحقق من الرسالة';
      } else if (error.message.includes('SERVER_ERROR')) {
        errorMessage = '🖥️ خطأ في الخادم، يرجى المحاولة لاحقاً';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Helper methods
  clearError: () => set({ error: null }),
  
  setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
  
  clearCurrentTicket: () => set({ currentTicket: null }),

  // Reset store
  reset: () => set({
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null,
    isCreating: false
  })
}));

export default useTicketsStore; 