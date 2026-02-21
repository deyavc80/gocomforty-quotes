import React, { useState, useEffect } from 'react';
import { Sparkles, Home, Building2, Key, MapPin, Calendar, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const GoComfortyQuoteCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    zipCode: '',
    serviceType: '',
    // Residential fields
    homeSize: '',
    bedrooms: '',
    bathrooms: '',
    hasPets: false,
    // Commercial fields
    knowsSize: '',
    squareFeet: '',
    numOffices: '',
    numBathrooms: '',
    hasKitchen: false,
    hasLobby: false,
    businessType: '',
    // Vacation Rental fields
    vrBedrooms: '',
    vrBathrooms: '',
    hasLaundry: false,
    // Common fields
    frequency: '',
    initialDeepCleaning: false,
    deepCleaning: false,
    windows: false,
    numWindows: '',
    appliances: false,
    carpets: false,
    carpetArea: '',
    blinds: false,
    numBlinds: '',
    upholstery: false,
    numSofas: '',
    floorWaxing: false,
    floorWaxingArea: '',
    // Contact
    referralSource: '',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });
  const [showEstimate, setShowEstimate] = useState(false);
  const [errors, setErrors] = useState({});

  // West Knoxville ZIP codes
  const validZipCodes = ['37919', '37922', '37934', '37923', '37909', '37921', '37916', '37931'];

  // Calculate estimate whenever relevant data changes
  useEffect(() => {
    calculateEstimate();
  }, [formData]);

  const calculateEstimate = () => {
    let min = 0;
    let max = 0;

    if (formData.serviceType === 'residential') {
      // Base prices for residential
      const sizePricing = {
        'studio': { min: 90, max: 120 },
        'small': { min: 120, max: 170 },
        'medium': { min: 170, max: 230 },
        'large': { min: 230, max: 350 }
      };
      
      if (formData.homeSize && sizePricing[formData.homeSize]) {
        min = sizePricing[formData.homeSize].min;
        max = sizePricing[formData.homeSize].max;
      }

      // Initial deep cleaning or recurring deep cleaning adds 50%
      if (formData.initialDeepCleaning || formData.deepCleaning) {
        min *= 1.5;
        max *= 1.5;
      }

    } else if (formData.serviceType === 'commercial') {
      if (formData.knowsSize === 'yes' && formData.squareFeet) {
        const sqft = parseInt(formData.squareFeet);
        if (sqft < 1000) {
          min = 110; max = 160;
        } else if (sqft < 3000) {
          min = 160; max = 280;
        } else if (sqft < 5000) {
          min = 280; max = 450;
        } else {
          min = 450; max = 650;
        }
        
        // Add bathroom cost even when size is known
        const bathrooms = parseInt(formData.numBathrooms) || 0;
        min += bathrooms * 30;
        max += bathrooms * 30;
        
      } else if (formData.knowsSize === 'no') {
        // Calculate based on components
        min = 75;
        max = 75;
        
        const offices = parseInt(formData.numOffices) || 0;
        const bathrooms = parseInt(formData.numBathrooms) || 0;
        
        min += offices * 18;
        max += offices * 18;
        min += bathrooms * 30;
        max += bathrooms * 30;
        
        if (formData.hasKitchen) {
          min += 25;
          max += 25;
        }
        if (formData.hasLobby) {
          min += 20;
          max += 20;
        }
      }

      // Initial deep cleaning or recurring deep cleaning adds 50% for commercial too
      if (formData.initialDeepCleaning || formData.deepCleaning) {
        min *= 1.5;
        max *= 1.5;
      }

    } else if (formData.serviceType === 'vacation') {
      const bedroomPricing = {
        '1': { min: 85, max: 120 },
        '2': { min: 120, max: 170 },
        '3': { min: 170, max: 230 },
        '4+': { min: 230, max: 320 }
      };
      
      if (formData.vrBedrooms && bedroomPricing[formData.vrBedrooms]) {
        min = bedroomPricing[formData.vrBedrooms].min;
        max = bedroomPricing[formData.vrBedrooms].max;
      }

      // Vacation rental frequency adjustments
      if (formData.frequency === 'turnover-deep') {
        min *= 1.10;
        max *= 1.10;
      } else if (formData.frequency === 'full-package') {
        min *= 1.15;
        max *= 1.15;
      }

      // Vacation rental specific extras (using same checkboxes but different pricing)
      if (formData.deepCleaning) { // Linen service
        min += 20;
        max += 20;
      }
      if (formData.windows) { // Restocking
        min += 15;
        max += 15;
      }
      if (formData.appliances) { // Damage inspection
        min += 10;
        max += 10;
      }
      if (formData.carpets) { // Same-day turnover
        min += 25;
        max += 25;
      }
    }

    // Add extras for residential and commercial only
    if (formData.serviceType !== 'vacation') {
      if (formData.windows && formData.numWindows) {
        const numWin = parseInt(formData.numWindows);
        if (formData.serviceType === 'commercial') {
          // Commercial windows have wider range (interior only)
          min += numWin * 5;
          max += numWin * 15;
        } else {
          // Residential windows standard pricing (interior only)
          min += numWin * 5;
          max += numWin * 5;
        }
      }
      if (formData.appliances && formData.serviceType === 'residential') {
        // Appliances only for residential
        min += 40;
        max += 60;
      }
      if (formData.carpets && formData.carpetArea) {
        const area = parseInt(formData.carpetArea);
        min += area * 0.30;
        max += area * 0.50;
      }
      if (formData.blinds && formData.numBlinds) {
        const numBl = parseInt(formData.numBlinds);
        min += numBl * 5;
        max += numBl * 8;
      }
      if (formData.upholstery && formData.serviceType === 'residential' && formData.numSofas) {
        // Upholstery only for residential
        const numSof = parseInt(formData.numSofas);
        min += numSof * 80;
        max += numSof * 150;
      }
      if (formData.floorWaxing && formData.serviceType === 'commercial' && formData.floorWaxingArea) {
        // Floor waxing only for commercial
        const area = parseInt(formData.floorWaxingArea);
        min += area * 0.10;
        max += area * 0.40;
      }
    }

    // Apply frequency discounts (only for residential and commercial)
    if (formData.serviceType !== 'vacation') {
      const frequencyDiscounts = {
        'daily': 0.75,
        'weekly': 0.85,
        'biweekly': 0.90,
        'triweekly': 0.93,
        'monthly': 0.95,
        'onetime': 1.0
      };
      
      if (formData.frequency && frequencyDiscounts[formData.frequency]) {
        const discount = frequencyDiscounts[formData.frequency];
        min *= discount;
        max *= discount;
      }
    }

    setEstimate({ min: Math.round(min), max: Math.round(max) });
  };

  const validateZipCode = (zip) => {
    return validZipCodes.includes(zip);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.zipCode) {
        newErrors.zipCode = 'Please enter your ZIP code';
      } else if (!validateZipCode(formData.zipCode)) {
        newErrors.zipCode = 'Sorry, we currently only serve West Knoxville. Valid ZIP codes: ' + validZipCodes.join(', ');
      }
    }

    if (currentStep === 2) {
      if (!formData.serviceType) {
        newErrors.serviceType = 'Please select a service type';
      }
    }

    if (currentStep === 3) {
      if (formData.serviceType === 'residential') {
        if (!formData.homeSize) newErrors.homeSize = 'Required';
        if (!formData.bedrooms) newErrors.bedrooms = 'Required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Required';
      } else if (formData.serviceType === 'commercial') {
        if (!formData.knowsSize) newErrors.knowsSize = 'Required';
        if (formData.knowsSize === 'yes' && !formData.squareFeet) {
          newErrors.squareFeet = 'Required';
        }
        if (formData.knowsSize === 'no') {
          if (!formData.numOffices) newErrors.numOffices = 'Required';
          if (!formData.numBathrooms) newErrors.numBathrooms = 'Required';
        }
      } else if (formData.serviceType === 'vacation') {
        if (!formData.vrBedrooms) newErrors.vrBedrooms = 'Required';
        if (!formData.vrBathrooms) newErrors.vrBathrooms = 'Required';
      }
    }

    if (currentStep === 4) {
      if (!formData.frequency) {
        newErrors.frequency = 'Please select a frequency';
      }
    }

    if (currentStep === 5) {
      if (!formData.fullName) newErrors.fullName = 'Required';
      if (!formData.email) newErrors.email = 'Required';
      if (!formData.phone) newErrors.phone = 'Required';
      
      // Email validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step === 4) {
        setShowEstimate(true);
      }
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setShowEstimate(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(5)) {
      try {
        // Replace this URL with your Google Apps Script Web App URL after deployment
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
        
        // Prepare data to send
        const submissionData = {
          ...formData,
          estimate: estimate,
          submittedAt: new Date().toISOString()
        };
        
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
        
        console.log('Form submitted:', submissionData);
        alert('Thank you! We will contact you shortly to schedule your free inspection.');
        
        // Optional: Reset form or redirect
        // window.location.href = '/thank-you';
        
      } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error submitting your request. Please try again or call us directly at (865) XXX-XXXX');
      }
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getFrequencyLabel = () => {
    if (formData.serviceType === 'vacation') {
      const labels = {
        'turnover': 'Turnover cleaning',
        'turnover-midstay': 'Turnover + Mid-stay',
        'turnover-deep': 'Turnover + Deep cleaning',
        'full-package': 'Full package'
      };
      return labels[formData.frequency] || '';
    } else {
      const labels = {
        'daily': 'Daily (-25%)',
        'weekly': 'Weekly (-15%)',
        'biweekly': 'Bi-weekly (-10%)',
        'triweekly': 'Every 3 weeks (-7%)',
        'monthly': 'Monthly (-5%)',
        'onetime': 'One-time'
      };
      return labels[formData.frequency] || '';
    }
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 5 && <div className={`flex-1 h-1 mx-2 transition-all ${
              s < step ? 'bg-primary' : 'bg-gray-200'
            }`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span>Location</span>
        <span>Service</span>
        <span>Details</span>
        <span>Frequency</span>
        <span>Contact</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12 px-4 font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .bg-primary {
          background-color: #00b3b3;
        }
        
        .text-primary {
          color: #00b3b3;
        }
        
        .border-primary {
          border-color: #00b3b3;
        }
        
        .hover-primary:hover {
          background-color: #2d8c8c;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #00b3b3 0%, #38aeae 100%);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2d8c8c 0%, #226a6a 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 179, 179, 0.3);
        }
        
        .card-hover {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 179, 179, 0.15);
        }
        
        .selected-card {
          border: 2px solid #00b3b3;
          background: linear-gradient(135deg, rgba(69, 217, 217, 0.1) 0%, rgba(0, 179, 179, 0.05) 100%);
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #00b3b3;
          box-shadow: 0 0 0 3px rgba(0, 179, 179, 0.1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .estimate-box {
          background: linear-gradient(135deg, #45d9d9 0%, #00b3b3 100%);
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Instant Quote Calculator
          </h2>
          <p className="text-gray-600 text-lg">
            Get your quote in less than 2 minutes
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          <ProgressBar />

          <form onSubmit={handleSubmit}>
            {/* Step 1: ZIP Code */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <MapPin className="text-primary w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Where are you located?</h3>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    maxLength="5"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    placeholder="37919"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-2">{errors.zipCode}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-2">
                    We currently serve West Knoxville (37919, 37922, 37934, 37923, 37909, 37921, 37916, 37931)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full btn-primary text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Service Type */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <Sparkles className="text-primary w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">What type of service do you need?</h3>
                </div>

                <div className="grid gap-4 mb-6">
                  {[
                    { id: 'residential', icon: Home, title: 'Residential', desc: 'Houses and apartments' },
                    { id: 'commercial', icon: Building2, title: 'Commercial', desc: 'Offices and businesses' },
                    { id: 'vacation', icon: Key, title: 'Vacation Rental', desc: 'Airbnb and short-term rentals' }
                  ].map((service) => (
                    <div
                      key={service.id}
                      onClick={() => updateFormData('serviceType', service.id)}
                      className={`card-hover p-6 border-2 rounded-xl ${
                        formData.serviceType === service.id ? 'selected-card' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <service.icon className="w-10 h-10 text-primary mr-4" />
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">{service.title}</h4>
                          <p className="text-gray-600 text-sm">{service.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mb-4">{errors.serviceType}</p>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:bg-gray-300 transition-all"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 btn-primary text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Service Details */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Space Details</h3>

                {/* RESIDENTIAL */}
                {formData.serviceType === 'residential' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Home size *</label>
                      <select
                        value={formData.homeSize}
                        onChange={(e) => updateFormData('homeSize', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      >
                        <option value="">Select...</option>
                        <option value="studio">Studio/Small apartment (&lt;800 sq ft)</option>
                        <option value="small">Small house (800-1,500 sq ft)</option>
                        <option value="medium">Medium house (1,500-2,500 sq ft)</option>
                        <option value="large">Large house (2,500+ sq ft)</option>
                      </select>
                      {errors.homeSize && <p className="text-red-500 text-sm mt-1">{errors.homeSize}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Bedrooms *</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.bedrooms}
                          onChange={(e) => updateFormData('bedrooms', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                        />
                        {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Bathrooms *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formData.bathrooms}
                          onChange={(e) => updateFormData('bathrooms', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                        />
                        {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hasPets}
                          onChange={(e) => updateFormData('hasPets', e.target.checked)}
                          className="w-5 h-5 text-primary mr-3"
                        />
                        <span className="text-gray-700">I have pets</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* COMMERCIAL */}
                {formData.serviceType === 'commercial' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Do you know the size of your office/space? *</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          onClick={() => updateFormData('knowsSize', 'yes')}
                          className={`card-hover p-4 border-2 rounded-lg text-center ${
                            formData.knowsSize === 'yes' ? 'selected-card' : 'border-gray-200'
                          }`}
                        >
                          <p className="font-semibold">Yes</p>
                        </div>
                        <div
                          onClick={() => updateFormData('knowsSize', 'no')}
                          className={`card-hover p-4 border-2 rounded-lg text-center ${
                            formData.knowsSize === 'no' ? 'selected-card' : 'border-gray-200'
                          }`}
                        >
                          <p className="font-semibold">No</p>
                        </div>
                      </div>
                      {errors.knowsSize && <p className="text-red-500 text-sm mt-1">{errors.knowsSize}</p>}
                    </div>

                    {formData.knowsSize === 'yes' && (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Square footage *</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.squareFeet}
                            onChange={(e) => updateFormData('squareFeet', e.target.value)}
                            placeholder="1500"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                          />
                          {errors.squareFeet && <p className="text-red-500 text-sm mt-1">{errors.squareFeet}</p>}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Number of restrooms *</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.numBathrooms}
                            onChange={(e) => updateFormData('numBathrooms', e.target.value)}
                            placeholder="e.g. 2 (men's + women's)"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                          />
                          <p className="text-gray-500 text-sm mt-1">
                            Count each separate restroom. e.g. men's + women's = 2
                          </p>
                          {errors.numBathrooms && <p className="text-red-500 text-sm mt-1">{errors.numBathrooms}</p>}
                        </div>
                      </>
                    )}

                    {formData.knowsSize === 'no' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Offices/Cubicles *</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.numOffices}
                              onChange={(e) => updateFormData('numOffices', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                            />
                            {errors.numOffices && <p className="text-red-500 text-sm mt-1">{errors.numOffices}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Restrooms *</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.numBathrooms}
                              onChange={(e) => updateFormData('numBathrooms', e.target.value)}
                              placeholder="e.g. 2"
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                            />
                            <p className="text-gray-500 text-xs mt-1">Each separate restroom counts as 1</p>
                            {errors.numBathrooms && <p className="text-red-500 text-sm mt-1">{errors.numBathrooms}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.hasKitchen}
                              onChange={(e) => updateFormData('hasKitchen', e.target.checked)}
                              className="w-5 h-5 text-primary mr-3"
                            />
                            <span className="text-gray-700">Has kitchen/break room</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.hasLobby}
                              onChange={(e) => updateFormData('hasLobby', e.target.checked)}
                              className="w-5 h-5 text-primary mr-3"
                            />
                            <span className="text-gray-700">Has lobby/waiting area</span>
                          </label>
                        </div>
                      </>
                    )}

                    {/* Business type - shows for both knowsSize yes and no */}
                    {formData.knowsSize && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Business type</label>
                        <select
                          value={formData.businessType}
                          onChange={(e) => updateFormData('businessType', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                        >
                          <option value="">Select...</option>
                          <option value="office">Office</option>
                          <option value="retail">Retail/Store</option>
                          <option value="medical">Medical/Dental</option>
                          <option value="restaurant">Restaurant/Café</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* VACATION RENTAL */}
                {formData.serviceType === 'vacation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Number of bedrooms *</label>
                      <select
                        value={formData.vrBedrooms}
                        onChange={(e) => updateFormData('vrBedrooms', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      >
                        <option value="">Select...</option>
                        <option value="1">1 bedroom</option>
                        <option value="2">2 bedrooms</option>
                        <option value="3">3 bedrooms</option>
                        <option value="4+">4+ bedrooms</option>
                      </select>
                      {errors.vrBedrooms && <p className="text-red-500 text-sm mt-1">{errors.vrBedrooms}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Number of bathrooms *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.vrBathrooms}
                        onChange={(e) => updateFormData('vrBathrooms', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      />
                      {errors.vrBathrooms && <p className="text-red-500 text-sm mt-1">{errors.vrBathrooms}</p>}
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hasLaundry}
                          onChange={(e) => updateFormData('hasLaundry', e.target.checked)}
                          className="w-5 h-5 text-primary mr-3"
                        />
                        <span className="text-gray-700">Has washer/dryer</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:bg-gray-300 transition-all"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 btn-primary text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Frequency & Extras */}
            {step === 4 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <Calendar className="text-primary w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {formData.serviceType === 'vacation' ? 'Service type' : 'Frequency'} & add-ons
                  </h3>
                </div>

                {/* Vacation Rental - Different options */}
                {formData.serviceType === 'vacation' ? (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">What type of service do you need? *</label>
                    <div className="grid gap-3">
                      {[
                        { id: 'turnover', label: 'Turnover cleaning', desc: 'Cleaning between each guest', discount: '' },
                        { id: 'turnover-midstay', label: 'Turnover + Mid-stay', desc: 'Turnover + cleaning during long stays', discount: '' },
                        { id: 'turnover-deep', label: 'Turnover + Deep cleaning', desc: 'Turnover + monthly deep cleaning', discount: '+10%' },
                        { id: 'full-package', label: 'Full package', desc: 'Turnover + Mid-stay + Monthly deep cleaning', discount: '+15%' }
                      ].map((freq) => (
                        <div
                          key={freq.id}
                          onClick={() => updateFormData('frequency', freq.id)}
                          className={`card-hover p-4 border-2 rounded-lg ${
                            formData.frequency === freq.id ? 'selected-card' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">{freq.label}</p>
                              <p className="text-sm text-gray-600">{freq.desc}</p>
                            </div>
                            {freq.discount && (
                              <span className="text-sm text-primary font-medium">{freq.discount}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.frequency && <p className="text-red-500 text-sm mt-2">{errors.frequency}</p>}
                  </div>
                ) : (
                  /* Residential & Commercial - Regular frequency */
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">How often? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.serviceType === 'commercial' ? (
                        /* Commercial frequencies including daily */
                        [
                          { id: 'daily', label: 'Daily', discount: '-25%' },
                          { id: 'weekly', label: 'Weekly', discount: '-15%' },
                          { id: 'biweekly', label: 'Bi-weekly', discount: '-10%' },
                          { id: 'monthly', label: 'Monthly', discount: '-5%' },
                          { id: 'onetime', label: 'One-time', discount: '' }
                        ].map((freq) => (
                          <div
                            key={freq.id}
                            onClick={() => updateFormData('frequency', freq.id)}
                            className={`card-hover p-4 border-2 rounded-lg text-center ${
                              formData.frequency === freq.id ? 'selected-card' : 'border-gray-200'
                            }`}
                          >
                            <p className="font-semibold text-gray-800">{freq.label}</p>
                            {freq.discount && (
                              <p className="text-sm text-primary font-medium">{freq.discount}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        /* Residential frequencies - no daily, includes every 3 weeks */
                        [
                          { id: 'weekly', label: 'Weekly', discount: '-15%' },
                          { id: 'biweekly', label: 'Bi-weekly', discount: '-10%' },
                          { id: 'triweekly', label: 'Every 3 weeks', discount: '-7%' },
                          { id: 'monthly', label: 'Monthly', discount: '-5%' },
                          { id: 'onetime', label: 'One-time', discount: '' }
                        ].map((freq) => (
                          <div
                            key={freq.id}
                            onClick={() => updateFormData('frequency', freq.id)}
                            className={`card-hover p-4 border-2 rounded-lg text-center ${
                              formData.frequency === freq.id ? 'selected-card' : 'border-gray-200'
                            }`}
                          >
                            <p className="font-semibold text-gray-800">{freq.label}</p>
                            {freq.discount && (
                              <p className="text-sm text-primary font-medium">{freq.discount}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {errors.frequency && <p className="text-red-500 text-sm mt-2">{errors.frequency}</p>}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">Add-on services</label>
                  <div className="space-y-3">
                    {formData.serviceType === 'vacation' ? (
                      /* Vacation Rental specific extras - ONLY these 4 */
                      <>
                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.deepCleaning}
                            onChange={(e) => updateFormData('deepCleaning', e.target.checked)}
                            className="w-5 h-5 text-primary mr-3"
                          />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Linen & Laundry Service</span>
                            <p className="text-sm text-gray-500">Wash, dry and fold sheets and towels (+$20)</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.windows}
                            onChange={(e) => updateFormData('windows', e.target.checked)}
                            className="w-5 h-5 text-primary mr-3"
                          />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Restocking Amenities</span>
                            <p className="text-sm text-gray-500">Restock supplies (coffee, soap, paper products, etc.) (+$15)</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.appliances}
                            onChange={(e) => updateFormData('appliances', e.target.checked)}
                            className="w-5 h-5 text-primary mr-3"
                          />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Damage Inspection</span>
                            <p className="text-sm text-gray-500">Photo report of property condition (+$10)</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.carpets}
                            onChange={(e) => updateFormData('carpets', e.target.checked)}
                            className="w-5 h-5 text-primary mr-3"
                          />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Same-day turnover</span>
                            <p className="text-sm text-gray-500">Urgent same-day cleaning (+$25)</p>
                          </div>
                        </label>
                      </>
                    ) : formData.serviceType === 'commercial' ? (
                      /* Commercial extras */
                      <>
                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.initialDeepCleaning} onChange={(e) => updateFormData('initialDeepCleaning', e.target.checked)} className="w-5 h-5 text-primary mr-3" />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">First cleaning / Initial deep cleaning</span>
                            <p className="text-sm text-gray-500">Recommended if it's your first time or you haven't had a deep clean in 6+ months. Includes hard-to-reach areas, behind furniture, baseboards, etc. (+50%)</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.deepCleaning} onChange={(e) => updateFormData('deepCleaning', e.target.checked)} className="w-5 h-5 text-primary mr-3" />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Scheduled deep cleaning</span>
                            <p className="text-sm text-gray-500">For recurring clients: schedule a deep clean every 3-6 months in addition to your regular service (+50% when performed)</p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.windows} onChange={(e) => updateFormData('windows', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Window cleaning (interior)</span>
                              <span className="text-sm text-gray-500">$5-15 per window</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Price varies by size. Large windows count as 2 windows</p>
                            {formData.windows && (
                              <input type="number" min="0" value={formData.numWindows} onChange={(e) => updateFormData('numWindows', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="How many windows? (approx.)" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.carpets} onChange={(e) => updateFormData('carpets', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Carpet cleaning</span>
                              <span className="text-sm text-gray-500">$0.30-0.50 per sq ft</span>
                            </div>
                            <p className="text-sm text-gray-500">Deep shampoo and extraction</p>
                            {formData.carpets && (
                              <input type="number" min="0" value={formData.carpetArea} onChange={(e) => updateFormData('carpetArea', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Approximate area in square feet" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.blinds} onChange={(e) => updateFormData('blinds', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Blind cleaning</span>
                              <span className="text-sm text-gray-500">$5-8 per blind</span>
                            </div>
                            <p className="text-sm text-gray-500">Professional blind cleaning</p>
                            {formData.blinds && (
                              <input type="number" min="0" value={formData.numBlinds} onChange={(e) => updateFormData('numBlinds', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="How many blinds?" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.floorWaxing} onChange={(e) => updateFormData('floorWaxing', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Floor waxing & buffing</span>
                              <span className="text-sm text-gray-500">$0.10-0.40 per sq ft</span>
                            </div>
                            <p className="text-sm text-gray-500">Professional floor waxing, buffing and polishing</p>
                            {formData.floorWaxing && (
                              <input type="number" min="0" value={formData.floorWaxingArea} onChange={(e) => updateFormData('floorWaxingArea', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Floor area in square feet" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>
                      </>
                    ) : (
                      /* Residential extras - ALL services available */
                      <>
                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.initialDeepCleaning} onChange={(e) => updateFormData('initialDeepCleaning', e.target.checked)} className="w-5 h-5 text-primary mr-3" />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">First cleaning / Initial deep cleaning</span>
                            <p className="text-sm text-gray-500">Recommended if it's your first time or you haven't had a deep clean in 6+ months. Includes hard-to-reach areas, behind appliances, baseboards, etc. (+50%)</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.deepCleaning} onChange={(e) => updateFormData('deepCleaning', e.target.checked)} className="w-5 h-5 text-primary mr-3" />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Scheduled deep cleaning</span>
                            <p className="text-sm text-gray-500">For recurring clients: schedule a deep clean every 3-6 months in addition to your regular service (+50% when performed)</p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.windows} onChange={(e) => updateFormData('windows', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Window cleaning (interior)</span>
                              <span className="text-sm text-gray-500">$5 per window</span>
                            </div>
                            {formData.windows && (
                              <input type="number" min="0" value={formData.numWindows} onChange={(e) => updateFormData('numWindows', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="How many windows?" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.appliances} onChange={(e) => updateFormData('appliances', e.target.checked)} className="w-5 h-5 text-primary mr-3" />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Appliances (fridge/oven)</span>
                            <p className="text-sm text-gray-500">Inside of fridge and oven (+$40-60)</p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.carpets} onChange={(e) => updateFormData('carpets', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Carpet cleaning</span>
                              <span className="text-sm text-gray-500">$0.30-0.50 per sq ft</span>
                            </div>
                            <p className="text-sm text-gray-500">Deep carpet shampooing</p>
                            {formData.carpets && (
                              <input type="number" min="0" value={formData.carpetArea} onChange={(e) => updateFormData('carpetArea', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Approximate area in square feet" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.blinds} onChange={(e) => updateFormData('blinds', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Blind cleaning</span>
                              <span className="text-sm text-gray-500">$5-8 per blind</span>
                            </div>
                            <p className="text-sm text-gray-500">Professional blind cleaning</p>
                            {formData.blinds && (
                              <input type="number" min="0" value={formData.numBlinds} onChange={(e) => updateFormData('numBlinds', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="How many blinds?" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all cursor-pointer">
                          <input type="checkbox" checked={formData.upholstery} onChange={(e) => updateFormData('upholstery', e.target.checked)} className="w-5 h-5 text-primary mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 font-medium">Upholstery/sofa cleaning</span>
                              <span className="text-sm text-gray-500">$80-150 per sofa</span>
                            </div>
                            <p className="text-sm text-gray-500">Steam cleaning of sofas and upholstered chairs</p>
                            {formData.upholstery && (
                              <input type="number" min="0" value={formData.numSofas} onChange={(e) => updateFormData('numSofas', e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="How many sofas/chairs?" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" />
                            )}
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Show live estimate */}
                {estimate.max > 0 && (
                  <div className="estimate-box text-white rounded-xl p-6 mb-6 text-center">
                    <p className="text-sm mb-2 opacity-90">Your current estimate:</p>
                    <p className="text-4xl font-bold mb-1">
                      ${estimate.min} - ${estimate.max}
                    </p>
                    <p className="text-sm opacity-90">
                      {formData.serviceType === 'vacation' ? 'per turnover' : 'per service'}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:bg-gray-300 transition-all"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 btn-primary text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center"
                  >
                    See full estimate
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Contact & Final Estimate */}
            {step === 5 && (
              <div className="animate-fadeIn">
                {/* Show Final Estimate */}
                {showEstimate && estimate.max > 0 && (
                  <div className="estimate-box text-white rounded-2xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 mr-2" />
                      <h3 className="text-2xl font-bold">Your Instant Estimate!</h3>
                    </div>
                    
                    <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-4">
                      <p className="text-5xl font-bold mb-2">
                        ${estimate.min} - ${estimate.max}
                      </p>
                      <p className="text-lg opacity-90">
                        {formData.serviceType === 'vacation' ? 'per turnover' : 'per service'}
                      </p>
                    </div>

                    <div className="text-left bg-white bg-opacity-10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        <span>Service: {
                          formData.serviceType === 'residential' ? 'Residential' :
                          formData.serviceType === 'commercial' ? 'Commercial' :
                          'Vacation Rental'
                        }</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        <span>Frequency: {getFrequencyLabel()}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        <span>Area: West Knoxville, TN</span>
                      </div>
                    </div>

                    <p className="text-sm mt-4 opacity-90">
                      ✨ Final price confirmed after FREE in-home estimate
                    </p>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Almost done! Tell us about yourself
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">How did you hear about us?</label>
                    <select
                      value={formData.referralSource}
                      onChange={(e) => updateFormData('referralSource', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    >
                      <option value="">Select an option</option>
                      <option value="mailer">Mailer</option>
                      <option value="online">Online</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="referral">Referral from Current Customer</option>
                      <option value="magazine">Magazine</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      placeholder="Jane Smith"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      placeholder="jane@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      placeholder="(865) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Address (optional)</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      placeholder="123 Main Street, Knoxville, TN"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Helps us schedule your estimate faster
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-50 border-2 border-primary rounded-lg p-4 mb-6">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">📞 Next steps:</span> We will contact you within 24 hours to schedule your FREE in-home estimate and confirm your exact price. No commitment required!
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:bg-gray-300 transition-all"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center"
                  >
                    Schedule free estimate
                    <CheckCircle2 className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p className="flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-primary mr-1" />
              100% Eco-Friendly
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-primary mr-1" />
              Free In-Home Estimate
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-primary mr-1" />
              No Commitment Required
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoComfortyQuoteCalculator;
