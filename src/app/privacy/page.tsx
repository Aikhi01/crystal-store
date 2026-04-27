export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-gray">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
      {[
        { title: '1. Information We Collect', body: 'We collect information you provide when creating an account or placing an order: name, email, shipping address, and payment details (processed securely by Stripe — we never store your card numbers).' },
        { title: '2. How We Use Your Information', body: 'We use your information to process orders, send shipping updates and receipts, respond to customer support inquiries, and improve our products and services. We do not sell your personal data to third parties.' },
        { title: '3. Cookies', body: 'We use cookies to keep you logged in and remember your cart. You can disable cookies in your browser settings, but this may affect site functionality.' },
        { title: '4. Data Security', body: 'We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits to protect your personal information.' },
        { title: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at hello@crystalhealing.co to exercise these rights.' },
        { title: '6. Contact', body: 'For privacy-related inquiries, email us at hello@crystalhealing.co.' },
      ].map(({title, body}) => (
        <div key={title} className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  )
}
