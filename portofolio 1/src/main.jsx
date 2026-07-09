import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./app.css"

// StrictMode DIHAPUS: App.jsx pakai banyak addEventListener manual (gaya vanilla JS)
// tanpa fungsi cleanup. StrictMode double-invoke useEffect di dev mode bikin
// semua listener (hover sound, toggle player, dll) kepasang 2x jadi kelakuannya aneh.
createRoot(document.getElementById('root')).render(<App />)
