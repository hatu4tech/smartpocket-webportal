import React, { useState } from 'react';
import { 
  DollarSign, Plus, Search, Edit, Eye, Trash2, Filter, 
  Download, Upload, CreditCard, School, User, Calendar,
  ChevronDown, X, Save, CheckCircle, Clock, XCircle,
  ArrowUpRight, ArrowDownRight, TrendingUp
} from 'lucide-react';

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      parentName: 'Jane Doe',
      studentName: 'John Doe',
      school: 'Green Valley High School',
      amount: 250.00,
      type: 'tuition',
      method: 'mobile_money',
      status: 'completed',
      date: '2024-08-01T10:30:00',
      description: 'Monthly tuition payment'
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      parentName: 'Robert Smith',
      studentName: 'Mary Smith',
      school: 'Riverside Academy',
      amount: 180.00,
      type: 'fees',
      method: 'bank_transfer',
      status: 'completed',
      date: '2024-08-02T14:15:00',
      description: 'Examination fees'
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      parentName: 'Sarah Wilson',
      studentName: 'David Wilson',
      school: 'Green Valley High School',
      amount: 75.00,
      type: 'books',
      method: 'credit_card',
      status: 'pending',
      date: '2024-08-03T09:20:00',
      description: 'Textbooks purchase'
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      parentName: 'Jane Doe',
      studentName: 'Sarah Doe',
      school: 'Green Valley High School',
      amount: 120.00,
      type: 'uniform',
      method: 'mobile_money',
      status: 'failed',
      date: '2024-08-04T16:45:00',
      description: 'School uniform purchase'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState('');

  const schools = ['Green Valley High School', 'Riverside Academy', 'Central Primary School'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  const types = ['tuition', 'fees', 'books', 'uniform', 'transport', 'meals', 'other'];
  const methods = ['mobile_money', 'bank_transfer', 'credit_card', 'cash'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = !selectedSchool || transaction.school === selectedSchool;
    const matchesStatus = !selectedStatus || transaction.status === selectedStatus;
    const matchesType = !selectedType || transaction.type === selectedType;
    
    return matchesSearch && matchesSchool && matchesStatus && matchesType;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      tuition: 'bg-blue-100 text-blue-800',
      fees: 'bg-purple-100 text-purple-800',
      books: 'bg-orange-100 text-orange-800',
      uniform: 'bg-green-100 text-green-800',
      transport: 'bg-yellow-100 text-yellow-800',
      meals: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate summary statistics
  const totalAmount = transactions.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0);
  const pendingAmount = transactions.reduce((sum, t) => t.status === 'pending' ? sum + t.amount : sum, 0);
  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Monitor and manage all financial transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
              <p className="text-sm text-gray-600">Pending Amount</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Transaction</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Parent & Student</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">School</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Method</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.transactionId}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.parentName}</p>
                      <p className="text-sm text-gray-500">for {transaction.studentName}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{transaction.school}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {transaction.method.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : transaction.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{formatDate(transaction.date)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      {transaction.status === 'pending' && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { TransactionsManagement };