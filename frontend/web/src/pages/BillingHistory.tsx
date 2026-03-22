import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UpdatePaymentModal from '../components/UpdatePaymentModal';

const MOCK_INVOICES = [
  { id: 1, date: "Sep 12, 2023", plan: "Pro Monthly", details: "Unlimited Recipes & AI Analysis", amount: "$24.99", status: "Pending" },
  { id: 2, date: "Aug 12, 2023", plan: "Pro Monthly", details: "Unlimited Recipes & AI Analysis", amount: "$24.99", status: "Paid" },
  { id: 3, date: "Jul 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Failed" },
  { id: 4, date: "Jun 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 5, date: "May 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 6, date: "Apr 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 7, date: "Mar 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 8, date: "Feb 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 9, date: "Jan 12, 2023", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
  { id: 10, date: "Dec 12, 2022", plan: "Basic Tier", details: "Standard Recipe Access", amount: "$9.99", status: "Paid" },
];

export default function BillingHistory() {
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  const filteredInvoices = MOCK_INVOICES.filter(invoice => 
    (statusFilter === "All" || invoice.status === statusFilter) &&
    (planFilter === "All" || invoice.plan === planFilter)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <div className="space-y-16 w-full">
        
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <nav className="flex items-center gap-2 text-sm text-secondary font-sans font-medium mb-4">
            <Link to="/settings" className="hover:text-primary transition-colors">Account</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface">Billing History</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">Billing History</h1>
          <p className="font-sans text-secondary max-w-xl text-lg leading-relaxed">
            Review your past transactions and manage your digital subscription tiers. Your current plan is <span className="text-primary font-bold italic border-b border-primary/20">Pro Edition</span>.
          </p>
        </div>

        {/* Dashboard Stats Summary (Bento Style) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col hover:shadow-md transition-shadow">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-secondary mb-2">Next Payment</span>
            <span className="font-serif text-3xl font-bold text-on-surface">Oct 12, 2023</span>
            <span className="font-sans mt-auto pt-4 text-primary font-bold text-sm flex items-center gap-1">
              $24.99 · Pro Plan
            </span>
          </div>

          <div className="bg-primary text-white p-8 rounded-xl shadow-xl flex flex-col col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col justify-center">
              <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Primary Payment Method</span>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-9 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <span className="font-sans text-xl font-medium tracking-widest">•••• 4242</span>
                </div>
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-colors border border-white/20"
                >
                  Update
                </button>
              </div>
            </div>
            {/* Abstract gradient texture */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-fixed/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
              <h2 className="font-serif text-xl font-bold text-primary">Transaction Logs</h2>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 font-sans text-sm font-bold transition-colors ${isFilterOpen ? 'text-primary' : 'text-secondary hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="px-8 py-6 border-b border-surface-container bg-surface-container-low/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-widest text-secondary mb-2">Subscription Plan</label>
                  <select 
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 font-sans text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="All">All Plans</option>
                    <option value="Pro Monthly">Pro Monthly</option>
                    <option value="Basic Tier">Basic Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-widest text-secondary mb-2">Payment Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 font-sans text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Date</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Plan Details</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Amount</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Status</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center bg-surface-container-lowest" style={{ height: "356px" }}>
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="material-symbols-outlined text-4xl text-secondary mb-2">search_off</span>
                          <p className="font-sans font-bold text-on-surface text-lg">No matching records</p>
                          <p className="font-sans text-sm text-secondary">Try adjusting your filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((invoice) => (
                      <tr key={invoice.id} className="group hover:bg-primary/5 transition-colors cursor-pointer">
                        <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">{invoice.date}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-sans font-bold text-on-surface">{invoice.plan}</span>
                            <span className="font-sans text-xs text-secondary mt-1">{invoice.details}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">{invoice.amount}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 font-sans text-xs font-bold rounded-full border ${
                            invoice.status === 'Paid' ? 'bg-primary-fixed/50 text-primary-fixed-variant border-primary-fixed' :
                            invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-error-container text-error border-error-container'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <a className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                            <span className="material-symbols-outlined text-lg">download</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                  
                  {filteredInvoices.length > 0 && Array.from({ length: ITEMS_PER_PAGE - paginatedInvoices.length }).map((_, index) => (
                    <tr key={`empty-${index}`} className="opacity-0 pointer-events-none select-none">
                      <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">{MOCK_INVOICES[0].date}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-on-surface">{MOCK_INVOICES[0].plan}</span>
                          <span className="font-sans text-xs text-secondary mt-1">{MOCK_INVOICES[0].details}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">{MOCK_INVOICES[0].amount}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-primary-fixed/50 text-primary-fixed-variant font-sans text-xs font-bold rounded-full border border-primary-fixed">{MOCK_INVOICES[0].status}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary transition-all shadow-sm">
                          <span className="material-symbols-outlined text-lg">download</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="px-8 py-6 bg-surface-container-low/30 border-t border-surface-container flex justify-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-secondary hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="px-4 font-sans text-xs font-bold text-primary uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-secondary hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Support Note */}
          <div className="mt-12 text-center pb-8">
            <p className="font-sans text-secondary text-sm">
              Questions about your billing? <a className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all" href="#">Contact our Concierge</a>
            </p>
          </div>
        </div>
      </div>
      <UpdatePaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
    </>
  );
}
