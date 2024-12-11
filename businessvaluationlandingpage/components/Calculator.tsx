import { useState } from 'react';
import { motion } from 'framer-motion';
import React from 'react';
import ContactModal from './ContactModal';

const industryMultipliers = {
  tech: { revenue: 3.5, profit: 15.0 },
  retail: { revenue: 0.8, profit: 8.0 },
  manufacturing: { revenue: 1.2, profit: 10.0 },
  services: { revenue: 1.5, profit: 12.0 }
};

// Define the type for calculation results
type CalculationResult = {
  assetBased: number;
  marketMultiple: number;
  dcf: number;
  recommendedRange: {
    min: number;
    max: number;
  };
} | null;

type ContactData = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
};

export default function Calculator() {
  const [formData, setFormData] = useState({
    annualRevenue: '',
    profitMargin: '',
    assetValue: '',
    industry: 'tech'
  });

  const [results, setResults] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<CalculationResult>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateValuation = (e: React.FormEvent) => {
    e.preventDefault();

    const revenue = parseFloat(formData.annualRevenue);
    const profitMargin = parseFloat(formData.profitMargin) / 100;
    const assetValue = parseFloat(formData.assetValue);
    const profit = revenue * profitMargin;

    // Asset-based valuation
    const assetBased = assetValue;

    // Market multiple valuation
    const multipliers = industryMultipliers[formData.industry as keyof typeof industryMultipliers];
    const revenueBasedValue = revenue * multipliers.revenue;
    const profitBasedValue = profit * multipliers.profit;
    const marketMultiple = (revenueBasedValue + profitBasedValue) / 2;

    // DCF valuation
    const growthRate = 0.05;
    const discountRate = 0.10;
    const years = 5;
    
    let dcfValue = 0;
    for (let i = 1; i <= years; i++) {
      dcfValue += profit * Math.pow(1 + growthRate, i) / Math.pow(1 + discountRate, i);
    }
    
    const terminalValue = (profit * Math.pow(1 + growthRate, years + 1)) / 
                        (discountRate - growthRate) / Math.pow(1 + discountRate, years);
    
    const dcf = dcfValue + terminalValue;

    const calculatedResults = {
      assetBased,
      marketMultiple,
      dcf,
      recommendedRange: {
        min: Math.min(assetBased, marketMultiple, dcf),
        max: Math.max(assetBased, marketMultiple, dcf)
      }
    };

    setCalculatedResults(calculatedResults);
    setShowModal(true);
  };

  const handleContactSubmit = async (contactData: ContactData) => {
    try {
      const response = await fetch('/api/submit-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactData,
          calculationData: {
            revenue: parseFloat(formData.annualRevenue),
            profitMargin: parseFloat(formData.profitMargin),
            assetValue: parseFloat(formData.assetValue),
            industry: formData.industry
          },
          result: calculatedResults
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }
      
      setShowModal(false);
      setShowResults(true);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div id="calculator" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Get a Quick Estimate of Your Business Value
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Use our calculator for a rough estimate. For an accurate, professional valuation, 
            <a href="#consultation" className="text-blue-600 hover:text-blue-500"> schedule a free consultation</a>.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={calculateValuation}
            className="space-y-6 bg-white p-8 rounded-lg shadow"
          >
            <div>
              <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700">
                Annual Revenue ($)
              </label>
              <input
                type="number"
                name="annualRevenue"
                id="annualRevenue"
                required
                min="0"
                value={formData.annualRevenue}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700">
                Profit Margin (%)
              </label>
              <input
                type="number"
                name="profitMargin"
                id="profitMargin"
                required
                min="0"
                max="100"
                value={formData.profitMargin}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="assetValue" className="block text-sm font-medium text-gray-700">
                Total Asset Value ($)
              </label>
              <input
                type="number"
                name="assetValue"
                id="assetValue"
                required
                min="0"
                value={formData.assetValue}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                name="industry"
                id="industry"
                required
                value={formData.industry}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tech">Technology</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Services</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Calculate Valuation
              </button>
            </div>
          </motion.form>

          {showModal && (
            <ContactModal
              onSubmit={handleContactSubmit}
              onClose={() => setShowModal(false)}
            />
          )}

          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        This is a preliminary estimate based on industry averages. For an accurate valuation that considers all aspects of your business,
                        <a href="#consultation" className="font-medium underline"> schedule a free consultation with our experts</a>.
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Valuation Results</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Asset-Based Valuation</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.assetBased)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Market Multiple Valuation</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.marketMultiple)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DCF Valuation</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.dcf)}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Recommended Valuation Range</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(results.recommendedRange.min)} - {formatCurrency(results.recommendedRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 