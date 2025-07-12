import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/Brend_name.png" 
                alt="EduEx.uz" 
                className="h-12 w-auto"
              />
            </Link>
            
            <p className="text-secondary-300 leading-relaxed">
              {t('companyDescription')}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-secondary-300 hover:text-white transition-colors">
                  {t('allCourses')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-secondary-300 hover:text-white transition-colors">
                  {t('instructors')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-secondary-300 hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-300 hover:text-white transition-colors">
                  {t('blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('categories')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?category=programming" className="text-secondary-300 hover:text-white transition-colors">
                  {t('programming')}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=design" className="text-secondary-300 hover:text-white transition-colors">
                  {t('design')}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=business" className="text-secondary-300 hover:text-white transition-colors">
                  {t('business')}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=marketing" className="text-secondary-300 hover:text-white transition-colors">
                  {t('marketing')}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=photography" className="text-secondary-300 hover:text-white transition-colors">
                  {t('photography')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-300">contact@eduex.uz</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                <span className="text-secondary-300">
                  123 Education Street<br />
                  Learning City, LC 12345
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">{t('subscribeNewsletter')}</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('yourEmail')}
                  className="flex-1 px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-l-lg focus:outline-none focus:border-primary-500"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm">
              © 2025 EduEx.uz. {t('allRightsReserved')}
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-secondary-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-secondary-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
              <Link to="/cookies" className="text-secondary-400 hover:text-white transition-colors">
                {t('cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
