'use client';

import { useState, useRef } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function DataManager() {
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [clearConfirm, setClearConfirm] = useState('');
    const [autoBackup, setAutoBackup] = useState(true);
    const fileRef = useRef<HTMLInputElement>(null);

    const showMsg = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 6000);
    };

    const handleExport = () => {
        window.open(`${BASE}/api/data/export`, '_blank');
        showMsg('success', 'Export download started!');
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImporting(true);
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const res = await fetch(`${BASE}/api/data/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json),
            });
            const data = await res.json();
            if (res.ok) {
                showMsg('success', `✅ ${data.message}`);
            } else {
                showMsg('error', data.error || 'Import failed');
            }
        } catch (err: any) {
            showMsg('error', err.message || 'Failed to parse file');
        } finally {
            setImporting(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleClearData = async () => {
        setClearing(true);
        try {
            if (autoBackup) {
                window.open(`${BASE}/api/data/export`, '_blank');
                await new Promise(r => setTimeout(r, 2000));
            }
            const res = await fetch(`${BASE}/api/data/clear`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                showMsg('success', '🗑️ All blog data has been cleared. You can restore from a backup anytime.');
            } else {
                showMsg('error', data.error || 'Clear failed');
            }
        } catch {
            showMsg('error', 'Network error while clearing data');
        } finally {
            setClearing(false);
            setShowClearModal(false);
            setClearConfirm('');
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">📦 Data Management</h3>

            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Export */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">📤</div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">Export Data</h4>
                        <p className="text-xs text-gray-500 mt-1">Download all posts and settings as a JSON backup file.</p>
                        <button onClick={handleExport} className="mt-3 px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export JSON Backup
                        </button>
                    </div>
                </div>
            </div>

            {/* Import */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">📥</div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">Import Data</h4>
                        <p className="text-xs text-gray-500 mt-1">Restore data from a previously exported JSON backup. Existing data is preserved.</p>
                        <label className={`mt-3 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            {importing ? 'Importing...' : 'Import JSON Backup'}
                            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Clear Data */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-lg flex-shrink-0">🗑️</div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-red-800">Danger Zone — Clear All Data</h4>
                        <p className="text-xs text-red-600 mt-1">Permanently removes all posts and settings. You will be offered a backup download first.</p>
                        <button onClick={() => setShowClearModal(true)} className="mt-3 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                            Clear All Blog Data
                        </button>
                    </div>
                </div>
            </div>

            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
                        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Clear All Blog Data?</h3>
                        <p className="text-gray-500 text-center text-sm mb-4">This will <strong className="text-red-600">permanently delete</strong> all posts and site settings.</p>
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-4 cursor-pointer select-none hover:bg-emerald-100 transition-colors">
                            <input type="checkbox" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
                            <div>
                                <span className="text-emerald-800 font-medium text-sm">Download backup before clearing</span>
                                <p className="text-emerald-600 text-xs mt-0.5">Saves all data as JSON so you can restore later</p>
                            </div>
                        </label>
                        <div className="mb-5">
                            <label className="block text-sm text-gray-500 mb-1.5">Type <strong className="text-gray-900">DELETE</strong> to confirm:</label>
                            <input type="text" value={clearConfirm} onChange={(e) => setClearConfirm(e.target.value)} placeholder="DELETE" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowClearModal(false); setClearConfirm(''); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
                            <button onClick={handleClearData} disabled={clearConfirm !== 'DELETE' || clearing} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {clearing ? 'Clearing...' : 'Yes, Clear Everything'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
