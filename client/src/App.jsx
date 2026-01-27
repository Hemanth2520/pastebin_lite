import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';
import './index.css';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="app">
                <Routes>
                    <Route path="/" element={<CreatePaste />} />
                    <Route path="/p/:id" element={<ViewPaste />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
