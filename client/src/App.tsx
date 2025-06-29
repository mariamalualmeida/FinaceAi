import { useState, useEffect } from 'react'
import { Router, Route, Switch } from 'wouter'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import GeminiChatArea from './components/GeminiChatArea'
import AdminPanel from './components/AdminPanel'
import { AppProvider } from './contexts/AppContext'
import CleanSettingsModal from './components/CleanSettingsModal'
import AdminAuthModal from './components/AdminAuthModal'
import { Toaster } from './components/ui/toaster'

function AppContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAdminAuth, setShowAdminAuth] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'light',
    interface: 'gemini',
    requireLogin: true
  })
  const [currentConversation, setCurrentConversation] = useState(null)
  const [conversations, setConversations] = useState([])

  // Clear system cache on app exit
  useEffect(() => {
    const clearSystemCache = () => {
      try {
        // Clear localStorage except for theme and essential settings
        const keysToKeep = ['theme', 'financeai-settings'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage
        sessionStorage.clear();

        // Clear browser cache if possible
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          });
        }

        console.log('System cache cleared successfully');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };

    // Add event listeners for page unload
    const handleBeforeUnload = () => {
      clearSystemCache();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearSystemCache();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearSystemCache(); // Clear cache when component unmounts
    };
  }, []);

  // Check authentication and load settings on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.log('Not authenticated')
      } finally {
        setLoading(false)
      }
    }

    const loadSettings = () => {
      const saved = localStorage.getItem('financeai-settings')
      if (saved) {
        try {
          setSettings(prev => ({ ...prev, ...JSON.parse(saved) }))
        } catch (error) {
          console.error('Failed to load settings:', error)
        }
      }
    }

    checkAuth()
    loadSettings()
  }, [])

  const updateSettings = (newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    localStorage.setItem('financeai-settings', JSON.stringify({ ...settings, ...newSettings }))
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    updateSettings({ theme: newTheme })
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleOpenAdminPanel = () => {
    if (isAdminAuthenticated) {
      setShowAdminPanel(true)
    } else {
      setShowAdminAuth(true)
    }
  }

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true)
    setShowAdminPanel(true)
  }

  // Função para carregar conversas
  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    }
  }

  // Função para criar nova conversa
  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: 'Nova Conversa' })
      })
      
      if (response.ok) {
        const newConversation = await response.json()
        setCurrentConversation(newConversation)
        await loadConversations()
      }
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error)
    }
  }

  // Função para excluir conversa (sem fechar sidebar)
  const deleteConversation = async (conversationId: string) => {
    if (!conversationId) return
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Se a conversa excluída era a atual, limpar
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null)
        }
        // Recarregar lista de conversas
        await loadConversations()
      }
    } catch (error) {
      console.error('Erro ao excluir conversa:', error)
    }
  }

  // Função para atualizar título da conversa com nome inteligente
  const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle })
      })
      
      if (response.ok) {
        await loadConversations()
        // Atualizar currentConversation se for a mesma
        if (currentConversation?.id === conversationId) {
          setCurrentConversation({...currentConversation, title: newTitle})
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar título da conversa:', error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Login screen - só mostra se login for obrigatório E usuário não estiver logado
  if (settings.requireLogin && !user) {
    return <Login onLogin={handleLogin} />
  }

  // Se login não for obrigatório e não há usuário, cria um usuário padrão
  if (!settings.requireLogin && !user) {
    const defaultUser = {
      id: 1,
      username: 'Usuário',
      email: 'user@financeai.com',
      role: 'user'
    }
    setUser(defaultUser)
    return (
      <div className={`flex items-center justify-center h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Main app
  return (
    <Router>
      <div className={`w-full h-full ${settings.theme === 'dark' ? 'dark' : ''}`}>
        <Switch>
          <Route path="/admin">
            <AdminPanel user={user} onClose={() => window.history.back()} />
          </Route>
          <Route>
            <div className="flex h-full w-full">
              <Sidebar 
                user={user} 
                onLogout={handleLogout}
                settings={settings}
                onUpdateSettings={updateSettings}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onClose={() => setSidebarOpen(false)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenAdminPanel={handleOpenAdminPanel}
                currentConversation={currentConversation}
                onSelectConversation={setCurrentConversation}
                onNewConversation={createNewConversation}
                onDeleteConversation={deleteConversation}
              />
              <GeminiChatArea 
                user={user}
                settings={{...settings, onToggleTheme: toggleTheme}}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
                currentConversation={currentConversation}
                onConversationUpdate={(conversationId) => {
                  // Recarregar conversas para incluir a nova
                  loadConversations()
                }}
                onUpdateConversationTitle={updateConversationTitle}
              />
            </div>
          </Route>
        </Switch>
        <Toaster />
        
        {/* Settings Modal */}
        <CleanSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          globalSettings={settings}
          onUpdateGlobalSettings={updateSettings}
        />

        {/* Admin Authentication Modal */}
        <AdminAuthModal
          isOpen={showAdminAuth}
          onClose={() => setShowAdminAuth(false)}
          onSuccess={handleAdminAuthSuccess}
        />

        {/* Admin Panel Modal */}
        {showAdminPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden">
              <AdminPanel 
                user={user} 
                onClose={() => setShowAdminPanel(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  )
}

export default AppContent;