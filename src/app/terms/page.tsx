export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
      {[
        { title: '1. Acceptance of Terms', body: 'By accessing and using Crystal Healing Co., you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our site.' },
        { title: '2. Products & Pricing', body: 'All prices are listed in USD. We reserve the right to change prices at any time. Products are subject to availability. We make every effort to display product colors accurately, but cannot guarantee your screen display is accurate.' },
        { title: '3. Orders & Payment', body: 'By placing an order you confirm that the information provided is accurate and complete. Payment is processed securely via Stripe. We reserve the right to refuse or cancel any order.' },
        { title: '4. Shipping', body: 'Shipping times are estimates and not guaranteed. We are not responsible for delays caused by customs, carrier issues, or incorrect address information provided by the customer.' },
        { title: '5. Returns', body: 'Items may be returned within 30 days of delivery in original, unworn condition. Custom or personalized items are final sale. Return shipping costs are the customer\'s responsibility unless the item is defective.' },
        { title: '6. Disclaimer', body: 'Crystal healing information is provided for educational purposes only and is not intended to replace medical advice. Our crystals are not medical devices.' },
        { title: '7. Governing Law', body: 'These terms are governed by the laws of the State of New York, USA, without regard to conflict of law principles.' },
      ].map(({title, body}) => (
        <div key={title} className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  )
}
