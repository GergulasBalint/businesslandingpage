import { motion } from 'framer-motion';
import { ChartBarIcon, CurrencyDollarIcon, BuildingOfficeIcon, ArrowTrendingUpIcon, UserGroupIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import React from 'react';

const features = [
  {
    name: 'Expert Consultation',
    description: 'Get personalized guidance from our experienced business valuation experts.',
    icon: UserGroupIcon,
  },
  {
    name: 'Comprehensive Analysis',
    description: 'We consider all aspects of your business, including assets, market position, and growth potential.',
    icon: DocumentChartBarIcon,
  },
  {
    name: 'Industry Insights',
    description: 'Benefit from our deep understanding of your specific industry and market trends.',
    icon: ChartBarIcon,
  },
  {
    name: 'Growth Planning',
    description: 'Receive strategic recommendations to increase your business value.',
    icon: ArrowTrendingUpIcon,
  },
  {
    name: 'Multiple Valuation Methods',
    description: 'We use various professional methods to determine the most accurate value of your business.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Detailed Reporting',
    description: 'Get a comprehensive report explaining all aspects of your business valuation.',
    icon: BuildingOfficeIcon,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Features() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Professional Business Valuation Services
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Get an accurate valuation with our expert consultation services
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <motion.div 
                key={feature.name} 
                variants={item}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
