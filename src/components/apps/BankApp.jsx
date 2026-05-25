/**
 * BankApp.jsx
 * Financial dashboard: balance, income/expenses, transaction ledger, tax info
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/gameLogic';

export default function BankApp() {
  const { state, getPortfolioValue } = useGame();
  const [tab, setTab] = useState('dashboard');
  const portfolioVal = getPortfolioValue();
  const netWorth = state.cash + portfolioVal;
  const totalIncome = state.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base">🏦 Bank & Wallet</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {tab === 'dashboard' && (
          <div>
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <p className="text-blue-200 text-xs mb-1">Current Balance</p>
              <p className="text-white text-2xl font-bold">{formatCurrency(state.cash)}</p>
              <div className="mt-3 flex items-center gap-4">
                <div><p className="text-green-300 text-[9px]">Net Worth</p><p className="text-white text-xs font-semibold">{formatCurrency(netWorth)}</p></div>
                <div><p className="text-cyan-300 text-[9px]">Portfolio</p><p className="text-white text-xs font-semibold">{formatCurrency(portfolioVal)}</p></div>
              </div>
            </div>


            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                <p className="text-gray-400 text-[9px]">Total Income</p>
                <p className="text-green-400 text-sm font-bold">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                <p className="text-gray-400 text-[9px]">Monthly Bills</p>
                <p className="text-red-400 text-sm font-bold">{formatCurrency(state.monthlyExpenses)}/mo</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                <p className="text-gray-400 text-[9px]">Taxes Paid</p>
                <p className="text-yellow-400 text-sm font-bold">{formatCurrency(state.taxesPaid)}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                <p className="text-gray-400 text-[9px]">Deals Done</p>
                <p className="text-purple-400 text-sm font-bold">{state.completedDeals.length}</p>
              </div>
            </div>

            {/* Expense Info */}
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-white text-xs font-semibold mb-2">📋 Auto Deductions</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-400 text-[10px]">🏠 Rent + Bills + Food</span><span className="text-red-400 text-[10px]">{formatCurrency(state.monthlyExpenses)}/30 days</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-[10px]">💰 Tax (every 90 days)</span><span className="text-yellow-400 text-[10px]">~10-20% of earnings</span></div>
              </div>
              <p className="text-gray-500 text-[9px] mt-2">Next bill: Day {Math.ceil(state.day / 30) * 30} | Next tax: Day {Math.ceil(state.day / 90) * 90}</p>
            </div>
          </div>
        )}


        {tab === 'ledger' && (
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">📜 Transaction History</h3>
            {state.transactions.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-2">
                {state.transactions.slice(0, 20).map((tx, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-medium">{tx.description}</p>
                        <p className="text-gray-500 text-[9px]">Day {tx.day} • {tx.category}</p>
                      </div>
                      <span className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom tabs */}
      <div className="flex items-center justify-around py-2 border-t border-gray-800 bg-gray-900">
        {[{ id: 'dashboard', icon: '🏠', label: 'Dashboard' }, { id: 'ledger', icon: '📜', label: 'Ledger' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 px-4 py-1 ${tab === t.id ? 'text-white' : 'text-gray-500'}`}>
            <span className="text-lg">{t.icon}</span><span className="text-[9px]">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
